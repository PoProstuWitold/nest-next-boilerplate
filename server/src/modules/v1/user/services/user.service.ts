import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountDto } from '../../../../common/dtos';
import { User } from '../../../../common/entities';
import { UserRepository } from '../user.repository';
import Providers from '../../auth/types/providers.enum';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) 
        private readonly userRepository: UserRepository
    ) {}


    public async create(data: CreateAccountDto) {
        
        const user = this.userRepository.create({
                provider: Providers.Local,
                providerId: null,
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                displayName: data.displayName
        })
        await this.userRepository.save(user)
        return user
    }

    public async getUserById(id) {
        const user = await this.userRepository.findOne({ where: { id } })
        return user
    }

    public async getByEmail(email: string) {
        const user = await this.userRepository.findOne({ where: { email } })
        return user
    }

    public async continueWithProvider(req: any) {
        let user: User
        // user = await this.userRepository.findOne({ where: { providerId: req.user.providerId } })
        const { providerId, email } = req.user
        user = await this.userRepository
            .createQueryBuilder()
            .where('provider_id = :providerId', { providerId })
            .orWhere('email = :email', { email })
            .getOne()

        if(user) {
            if(req.user.email === user.email && user.provider == 'local') {
                throw new BadRequestException('User with email same as the social provider already exists')
            }
        }

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
