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

import { ChatService } from './chat.service';
import { User } from '../../../common/entities';

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
        private readonly chatService: ChatService
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
            this.logger.log(`Connection established: ${user.id}`)
        } catch (err) {
            throw err
        }
    }

    public async handleDisconnect(socket: Socket): Promise<void> {
        this.logger.log(`Connection ended`)
    }

    public async afterInit() {
        this.logger.log('Gateway has been initialized')
    }

    @SubscribeMessage('message:create')
    public async onMessageAdd(
        @ConnectedSocket() socket: UserSocket,
        @MessageBody() message: string
    ) {
        console.log(message, socket.user);
        this.server.emit('message', message)
    }

    @SubscribeMessage('room:create')
    public async onRoomCreate(socket: Socket) {
        console.log(socket);
    }

    @SubscribeMessage('room:join')
    public async onRoomJoin(socket: Socket) {
        
    }
}