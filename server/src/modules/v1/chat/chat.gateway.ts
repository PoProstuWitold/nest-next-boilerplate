import { Logger, OnModuleInit } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { ChatService } from './chat.service';
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
            this.logger.error(err)
            throw new WsException(err)
        }
    }

    public async handleDisconnect(socket: UserSocket): Promise<void> {
        try {
            socket.disconnect()
            this.logger.log(`Connection ended`)
            return
        } catch (err) {
            this.logger.error(err)
            throw new WsException(err)
        }
    }

    public async afterInit() {
        this.logger.log('Gateway has been initialized')
    }

    @SubscribeMessage('message:create')
    public async onMessageAdd(
        @ConnectedSocket() socket: UserSocket,
        @MessageBody() data: { message: string, roomId: string }
    ) {
        try {
            const { message, roomId } = data
            const createdMessage = await this.messageService.create(socket.user, roomId, message)
            for(const room of socket.rooms) {
                if(createdMessage.room.id === room) {
                    this.server.to(room).emit('message:created', createdMessage)
                }
            }
        } catch (err) {
            this.logger.error(err)
            throw new WsException(err)
        }
    }

    @SubscribeMessage('room:create')
    public async onRoomCreate(
        @ConnectedSocket() socket: UserSocket,
        @MessageBody() data: { name: string, description?: string, isPublic?: boolean}
    ) {
        try {
            const createdRoom = await this.roomService.createRoom(data, socket.user)
            socket.join(createdRoom.id)
            for (const user of createdRoom.users) {
                const rooms = await this.roomService.getUserRooms(user.id)
                this.server.to(socket.id).emit('room:all', rooms)
            }
        } catch (err) {
            this.server.to(socket.id).emit('error:room-create', err)
            this.logger.error(err)
            throw new WsException(err)
        }
    }

    @SubscribeMessage('room:edit')
    public async onRoomEdit(
        @ConnectedSocket() socket: UserSocket,
        @MessageBody() data: { name: string, description?: string, isPublic?: boolean, roomId: string}
    ) {
        try {
            const { name, description, isPublic, roomId } = data
            const updatedRoom = await this.roomService.updateRoom(roomId, { name, description, isPublic})
            if(updatedRoom.success) {
                const rooms = await this.roomService.getUserRooms(socket.user.id)
                this.server.to(socket.id).emit('room:all', rooms)
            }
        } catch (err) {
            this.server.to(socket.id).emit('error:room-edit', err)
            this.logger.error(err)
            throw new WsException(err)
        }
    }

    @SubscribeMessage('room:join')
    public async onRoomJoin(
        @ConnectedSocket() socket: UserSocket,
        @MessageBody() data: { roomId: string }
    ) {
        try {
            const { roomId } = data
            const messages = await this.messageService.findMessagesForRoom(roomId)
            this.server.to(socket.id).emit('room:messages', messages)
        } catch (err) {
            this.logger.error(err)
            throw new WsException(err)
        }
    }

    @SubscribeMessage('room:delete')
    public async onRoomDelete(
        @ConnectedSocket() socket: UserSocket,
        @MessageBody() data: { roomId: string, owner: any }
    ) {
        try {
            const { roomId, owner } = data
            if(owner.id === socket.user.id) {
                await this.roomService.deleteRoom(roomId)
                const rooms = await this.roomService.getUserRooms(socket.user.id)
                this.server.to(socket.id).emit('room:all', rooms)
            }
        } catch (err) {
            this.logger.error(err)
            throw new WsException(err)
        }
    }


    @SubscribeMessage('room:all')
    public async onRoomAll(
        @ConnectedSocket() socket: UserSocket
    ) {
        try {
            const rooms = await this.roomService.getUserRooms(socket.user.id)
            this.server.to(socket.id).emit('room:all', rooms)
        } catch (err) {
            this.logger.error(err)
            throw new WsException(err)
        }
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