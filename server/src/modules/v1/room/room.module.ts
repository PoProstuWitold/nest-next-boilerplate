import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypeOrmExModule } from '../../../database/typeorm-ex.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { RoomController } from './room.controller';
import { Room } from './room.entity';
import { RoomRepository } from './room.repository';
import { RoomService } from './room.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Room]),
        TypeOrmExModule.forCustomRepository([RoomRepository]),
        UserModule,
        AuthModule
    ],
    controllers: [RoomController],
    providers: [RoomService],
    exports: [RoomService]
})
export class RoomModule {}