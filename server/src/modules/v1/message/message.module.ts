import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypeOrmExModule } from '../../../database/typeorm-ex.module';
import { AuthModule } from '../auth/auth.module';
import { RoomModule } from '../room/room.module';
import { UserModule } from '../user/user.module';
import { MessageController } from './message.controller';
import { Message } from './message.entity'
import { MessageRepository } from './message.repository';
import { MessageService } from './message.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Message]),
        TypeOrmExModule.forCustomRepository([MessageRepository]),
        RoomModule,
        AuthModule,
        UserModule
    ],
    controllers: [MessageController],
    providers: [MessageService],
    exports: [MessageService]
})
export class MessageModule {}