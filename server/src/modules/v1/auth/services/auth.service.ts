import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { UserRepository } from '../../../../common/repositories';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(UserRepository)
        private readonly usersRepository: UserRepository
    ) {}

    async register() {

    }

    async login(user) {
        return {
            accessToken: this.jwtService.sign(user)
        }
    }

    async logout() {
        
    }

    async googleLogin(req: Request) {
        if (!req.user) {
            return 'No user from google'
        }
      
        return {
            message: 'User information from google',
            user: req.user
        }
    }
}
