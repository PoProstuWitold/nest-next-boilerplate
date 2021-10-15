import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../common/entities';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, UserRepository])
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}
