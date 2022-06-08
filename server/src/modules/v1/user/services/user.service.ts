import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountDto } from '../../../../common/dtos';
import { User } from '../../../../common/entities';
import { UserRepository } from '../repositories/user.repository';
import Providers from '../../../../common/enums/providers.enum';

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


    public async getUserByField(field: string, value: string | number) {
        const user = await this.userRepository.findOne({ where: { [field]: value } })
        return user
    }

    public async continueWithProvider(req: any) {
        let user: User

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

        if(!user) {
            user = this.userRepository.create({
                provider: req.user.provider,
                providerId: req.user.providerId,
                email: req.user.email,
                password: req.user.password,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                displayName: req.user.displayName,
                image: req.user.image
            })

            await this.userRepository.save(user)
        }

        return user
    }
}
