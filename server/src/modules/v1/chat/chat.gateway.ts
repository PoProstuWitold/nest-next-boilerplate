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
import { UserService } from '../user/user.service';
import { RoomService } from '../room/room.service';
import { ConnectedUserService } from './services/connected-user.service';
import { JoinedRoomService } from './services/joined-room.service';
import { MessageService } from '../message/message.service';

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
        private readonly userService: UserService,
        private readonly roomService: RoomService,
        private readonly connectedUserService: ConnectedUserService,
        private readonly joinedRoomService: JoinedRoomService,
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
            await this.connectedUserService.create({ socketId: socket.id, user })
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
        await this.connectedUserService.deleteBySocketId(socket.id)
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
        const room = await this.roomService.getRoomForMessages(createdMessage.room.id)
        const joinedUsers = await this.joinedRoomService.findByRoom(room)
        console.log(joinedUsers)
        for(const user of joinedUsers) {
            console.log(user.socketId)
            console.log(socket.id)
            this.server.to(user.socketId).emit('message:created', createdMessage)
        }
    }

    @SubscribeMessage('room:create')
    public async onRoomCreate(
        @ConnectedSocket() socket: UserSocket,
        @MessageBody() data: { message: string, roomId: string }
    ) {
        console.log(socket);
    }

    @SubscribeMessage('room:join')
    public async onRoomJoin(
        @ConnectedSocket() socket: UserSocket,
        @MessageBody() data: { message: string, roomId: string }
    ) {
        const { roomId } = data
        const messages = await this.messageService.findMessagesForRoom(roomId)
        const room = await this.roomService.getRoom(roomId, { relationIds: false })
        await this.joinedRoomService.create({ socketId: socket.id, user: socket.data.user, room })
        await this.server.to(socket.id).emit('messages:all', messages)
    }
}