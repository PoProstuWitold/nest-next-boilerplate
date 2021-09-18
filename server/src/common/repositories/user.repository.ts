import { NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { EntityRepository, Repository } from 'typeorm'
import { CreateAccountDto } from 'common/dtos'
import { User } from 'common/entities'

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    constructor() {
      super()
    }

    async createUser(dto: CreateAccountDto): Promise<void> {
        const newUser: User = new User({
            email: dto.email,
            password: dto.password,
            firstName: dto.firstName,
            lastName: dto.lastName,
            displayName: dto.displayName
        })

        try {
            await this.save(newUser)
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
        try {
            return await this.findOneOrFail({ where: { id } })
        } catch (err) {
            throw new NotFoundException('User with provided id not found')
        }
    }
}