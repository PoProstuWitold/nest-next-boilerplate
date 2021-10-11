import { HttpException, HttpStatus, NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { EntityRepository, Repository } from 'typeorm'
import { CreateAccountDto } from '../../common/dtos'
import { User } from '../../common/entities'

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    constructor() {
      super()
    }

    async createUser(dto: CreateAccountDto): Promise<User> {
        const newUser: User = new User({
            email: dto.email,
            password: dto.password,
            firstName: dto.firstName,
            lastName: dto.lastName,
            displayName: dto.displayName
        })

        try {
            await this.save(newUser)
            return newUser
        } catch (err) {
            throw new UnprocessableEntityException('Something went wrong with saving user')
        }
    }

    async getUserByNick(displayName: string): Promise<User> {
        try {
            const profile: User = await this.findOneOrFail({ displayName })
            return profile
        } catch (err) {
            throw new NotFoundException('User with provided nick not found')
        }
    }

    async getUserByEmail(email: string): Promise<User> {
        try {
            return await this.findOneOrFail({ email })
        } catch (err) {
            throw new NotFoundException('User with provided email not found')
        }
    }

    async getUserById(id: number): Promise<User> {
        const user = await this.findOne({ where: { id } })

        if(!user) {
            throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND)
        }

        return user
    }

    async getUserByProviderId(providerId: number): Promise<User | null> {
        const user = await this.findOne({ where: { providerId } })

        if(!user) {
            throw new HttpException('User with this providerId does not exist', HttpStatus.NOT_FOUND)
        }

        return user
    }
}