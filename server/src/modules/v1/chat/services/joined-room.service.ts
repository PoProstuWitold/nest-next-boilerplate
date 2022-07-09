import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
    
    public async findByUser(user: any): Promise<any[]> {
        return this.joinedRoomRepository.find(user)
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