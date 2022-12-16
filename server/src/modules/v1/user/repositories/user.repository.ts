import { HttpException, HttpStatus, NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { FindOperator, Repository } from 'typeorm'
import { CreateAccountDto } from '../../../../common/dtos'
import { User } from '../../../../common/entities'

export class UserRepository extends Repository<User> {

    
}