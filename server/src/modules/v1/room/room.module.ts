import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { RoomController } from './room.controller';
import { Room, Invitation } from './entities';
import { RoomService } from './room.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Room, Invitation]),
        UserModule,
        AuthModule
    ],
    controllers: [RoomController],
    providers: [RoomService],
    exports: [RoomService]
})
export class RoomModule {}