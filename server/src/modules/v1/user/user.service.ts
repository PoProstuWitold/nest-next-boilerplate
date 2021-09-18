import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'common/entities';
import { UserRepository } from 'common/repositories';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) 
        private readonly userRepository: UserRepository
    ) {}

    public async getUserById(id) {
        this.userRepository.getUserById(id)
    }
}
