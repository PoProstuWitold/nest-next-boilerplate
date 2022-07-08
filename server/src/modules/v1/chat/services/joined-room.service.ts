import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { EqualOperator, FindOperator, FindOptionsWhere, Repository } from 'typeorm';

import { Room } from '../../room/room.entity';
import { User } from '../../../../common/entities';
import { JoinedRoom } from '../entites';

@Injectable()
export class JoinedRoomService {
    constructor(
        @InjectRepository(JoinedRoom)
        private readonly joinedRoomRepository: Repository<JoinedRoom>
    ) {}
    
    public async create(joinedRoom: any): Promise<any> { 
        return this.joinedRoomRepository.save(joinedRoom)
    }
    
    public async findByUser(user: boolean | FindOperator<User> | FindOptionsWhere<User> | FindOptionsWhere<User>[] | EqualOperator<User>): Promise<any[]> {
        return this.joinedRoomRepository.find({ where: { user } })
    }
    
    public async findByRoom(room: any): Promise<any[]> {
        return this.joinedRoomRepository.find(room)
    }
    
    public async deleteBySocketId(socketId: string) {
        return this.joinedRoomRepository.delete({ socketId })
    }
    
    public async deleteAll() {
        await this.joinedRoomRepository
            .createQueryBuilder()
            .delete()
            .execute()
    }

}