import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../../common/repositories';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(UserRepository)
        private readonly usersRepository: UserRepository
    ) {}

    async register() {

    }

    async login() {

    }

    async logout() {
        
    }
}
