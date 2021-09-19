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

    public async continueWithProvider(req: any) {
        let user: any
        user = await this.userRepository.findOne({ where: { providerId: req.user.providerId } })
        // console.log('oldUser', user)
        if(!user) {
            user = this.userRepository.create({
                provider: req.user.provider,
                providerId: req.user.providerId,
                email: req.user.email,
                password: req.user.password,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                displayName: req.user.displayName
            })
            // console.log('newUser', user)
            await this.userRepository.save(user)
        }

        return user
    }
}
