import { Module } from '@nestjs/common'

import { AuthModule } from '../auth/auth.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './services/chat.service';
import { UserModule } from '../user/user.module';
import { RoomModule } from '../room/room.module';
import { MessageModule } from '../message/message.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        RoomModule,
        MessageModule,
    ],
    providers: [
        ChatGateway,
        ChatService,
    ]
})
export class ChatModule {}