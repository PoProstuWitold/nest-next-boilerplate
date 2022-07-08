import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { EqualOperator, FindOperator, FindOptionsWhere, Repository } from 'typeorm';

import { User } from '../../../../common/entities';
import { ConnectedUser } from '../entites';

@Injectable()
export class ConnectedUserService {
    constructor(
        @InjectRepository(ConnectedUser)
        private readonly connectedUserRepository: Repository<ConnectedUser>
    ) {}
    
    public async create(connectedUser: any): Promise<any> {
        return this.connectedUserRepository.save(connectedUser);
    }
    
    public async findByUser(user: boolean | FindOperator<User> | FindOptionsWhere<User> | FindOptionsWhere<User>[] | EqualOperator<User>): Promise<any[]> {
        return this.connectedUserRepository.find({ where: { user } })
    }
    
    public async deleteBySocketId(socketId: string) {
        return this.connectedUserRepository.delete({ socketId })
    }
    
    public async deleteAll() {
        await this.connectedUserRepository
            .createQueryBuilder()
            .delete()
            .execute()
    }

}