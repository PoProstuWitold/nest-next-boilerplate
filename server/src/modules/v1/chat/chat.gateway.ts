import { Logger, OnModuleInit } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { ChatService } from './services/chat.service';
import { User } from '../../../common/entities';
import { RoomService } from '../room/room.service';
import { MessageService } from '../message/message.service';
import { Room } from '../room/room.entity';

interface UserSocket extends Socket {
    user: User
}

@WebSocketGateway({
    cors: {
        origin: 'http://localhost:3000',
        credentials: true
    },
    namespace: 'chat'
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, OnModuleInit {
    @WebSocketServer()
    public server: Server;

    private readonly logger: Logger = new Logger('ChatGateway')

    constructor(
        private readonly chatService: ChatService,
        private readonly roomService: RoomService,
        private readonly messageService: MessageService
    ) {}

    public async onModuleInit() {
        this.logger.log('Module has been initialized')
    }

    public async handleConnection(socket: UserSocket): Promise<void> {
        try {
            const user = await this.chatService.getUserFromSocket(socket)
            if(!user) {
                socket.disconnect(true)
                return 
            }
            socket.user = user
            const rooms = await this.roomService.getUserRooms(user.id)
            socket.join(this.getRoomsId(rooms))
            socket.join(user.id)
            this.logger.log(`Connection established: ${user.id}`)
            this.server.to(socket.id).emit('room:all', rooms)
            return 
        } catch (err) {
            socket.disconnect(true)
            throw err
        }
    }

    public async handleDisconnect(socket: UserSocket): Promise<void> {
        socket.user = undefined
        socket.disconnect()
        this.logger.log(`Connection ended`)
        return
    }

    public async afterInit() {
        this.logger.log('Gateway has been initialized')
    }

    @SubscribeMessage('message:create')
    public async onMessageAdd(
        @ConnectedSocket() socket: UserSocket,
        @MessageBody() data: { message: string, roomId: string }
    ) {
        const { message, roomId } = data
        const createdMessage = await this.messageService.create(socket.user, roomId, message)
        for(const room of socket.rooms) {
            if(createdMessage.room.id === room) {
                this.server.to(room).emit('message:created', createdMessage)
            }
        }
    }

    @SubscribeMessage('room:create')
    public async onRoomCreate(
        @ConnectedSocket() socket: UserSocket,
        @MessageBody() data: { name: string, description?: string, public?: boolean}
    ) {
        const createdRoom = await this.roomService.createRoom(data, socket.user)
        for (const user of createdRoom.users) {
            const rooms = await this.roomService.getUserRooms(user.id)
            this.server.to(socket.id).emit('room:all', rooms)
        }
    }

    @SubscribeMessage('room:join')
    public async onRoomJoin(
        @ConnectedSocket() socket: UserSocket,
        @MessageBody() data: { roomId: string }
    ) {
        const { roomId } = data
        const messages = await this.messageService.findMessagesForRoom(roomId)
        this.server.to(socket.id).emit('room:messages', messages)
    }

    @SubscribeMessage('room:leave')
    public async onRoomLeave(
        @ConnectedSocket() socket: UserSocket
    ) {}

    private getRoomsId(rooms: Room[]) {
        let roomsIds: string[] = []
        for(const room of rooms) {
            roomsIds.push(room.id)
        }
        return roomsIds
    }
}