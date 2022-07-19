import { NotFoundException } from '@nestjs/common'
import { FindOperator, Repository } from 'typeorm'

import { User } from '../../../../common/entities'
import { CustomRepository } from '../../../../database/typeorm-ex.decorator'
import { RoomDto } from '../dto/room.dto'
import { Room } from '../entities/room.entity'

@CustomRepository(Room)
export class RoomRepository extends Repository<Room> {

    public async createRoom(dto: RoomDto, owner: User): Promise<Room> {
        const room: Room = new Room({
            name: dto.name,
            description: dto.description,
            isPublic: dto.isPublic,
            owner,
            users: [owner],
            mods: [owner]
        })

        try {
            await this.save(room)
            return room
        } catch (err) {
            throw err
        }
    }

    public async getRoom(id: string | FindOperator<string>, relationIds?: boolean): Promise<Room> {
        try {
            const room: Room = await this.findOneOrFail({ 
                // relations: [
                // 'owner', 'users', 'mods'
                // ],
                loadRelationIds: relationIds || false,
                where: {
                    // isPublic: true, 
                    id
                }
            })
            return room
        } catch (err) {
            throw new NotFoundException('Room with this id does not exist')
        }
    }
}