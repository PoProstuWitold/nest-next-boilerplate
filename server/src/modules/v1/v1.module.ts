import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { RoomModule } from './room/room.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        ChatModule,
        MessageModule,
        RoomModule
    ]
})
export class V1Module {}
