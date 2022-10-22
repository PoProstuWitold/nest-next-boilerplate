import { Module } from '@nestjs/common'

import { AuthModule } from '../auth/auth.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { UserModule } from '../user/user.module';
import { RoomModule } from '../room/room.module';
import { MessageModule } from '../message/message.module';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        RoomModule,
        MessageModule,
        ConversationModule
    ],
    providers: [
        ChatGateway,
        ChatService,
    ]
})
export class ChatModule {}