import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './services/chat.service';
import { ConnectedUser, JoinedRoom } from './entites';
import { UserModule } from '../user/user.module';
import { RoomModule } from '../room/room.module';
import { MessageModule } from '../message/message.module';
import { ConnectedUserService } from './services/connected-user.service';
import { JoinedRoomService } from './services/joined-room.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ConnectedUser, JoinedRoom]),
        AuthModule,
        UserModule,
        RoomModule,
        MessageModule,
    ],
    providers: [
        ChatGateway,
        ChatService,
        ConnectedUserService,
        JoinedRoomService,
    ]
})
export class ChatModule {}