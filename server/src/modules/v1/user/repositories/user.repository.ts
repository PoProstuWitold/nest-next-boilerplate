import { HttpException, HttpStatus, NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { CustomRepository } from '../../../../database/typeorm-ex.decorator'
import { FindOperator, Repository } from 'typeorm'
import { CreateAccountDto } from '../../../../common/dtos'
import { User } from '../../../../common/entities'

@CustomRepository(User)
export class UserRepository extends Repository<User> {

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

    async getUserByNick(displayName: string | FindOperator<string>): Promise<User> {
        try {
            const profile: User = await this.findOneOrFail({ where: { displayName } })
            return profile
        } catch (err) {
            throw new NotFoundException('User with provided nick not found')
        }
    }

    async getUserByEmail(email: string | FindOperator<string>): Promise<User> {
        try {
            return await this.findOneOrFail({ where: { email } })
        } catch (err) {
            throw new NotFoundException('User with provided email not found')
        }
    }

    async getUserById(id: string | FindOperator<string>): Promise<User> {
        const user = await this.findOne({ where: { id } })

        if(!user) {
            throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND)
        }

        return user
    }

    async getUserByProviderId(providerId: string | FindOperator<string>): Promise<User | null> {
        const user = await this.findOne({ where: { providerId } })

        if(!user) {
            throw new HttpException('User with this providerId does not exist', HttpStatus.NOT_FOUND)
        }

        return user
    }
}