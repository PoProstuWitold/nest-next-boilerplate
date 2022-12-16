import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { ConversationModule } from '../conversation/conversation.module';
import { RoomModule } from '../room/room.module';
import { UserModule } from '../user/user.module';
import { MessageController } from './message.controller';
import { Message } from './message.entity'
import { MessageService } from './message.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Message]),
        RoomModule,
        AuthModule,
        UserModule,
        ConversationModule
    ],
    controllers: [MessageController],
    providers: [MessageService],
    exports: [MessageService]
})
export class MessageModule {}