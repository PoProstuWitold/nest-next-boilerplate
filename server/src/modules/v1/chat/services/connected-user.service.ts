import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConnectedUser } from '../entites';

@Injectable()
export class ConnectedUserService {
    constructor(
        @InjectRepository(ConnectedUser)
        private readonly connectedUserRepository: Repository<ConnectedUser>
    ) {}
    
    public async create(connectedUser: any): Promise<any> {
        return this.connectedUserRepository.save(connectedUser)
    }
    
    public async findByUser(user: any): Promise<any[]> {
        return this.connectedUserRepository.find(user)
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