import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../../../common/entities';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './/user.controller';
import { UserService } from './user.service';
import { TypeOrmExModule } from '../../../database/typeorm-ex.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        TypeOrmExModule.forCustomRepository([User, UserRepository]),
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}
