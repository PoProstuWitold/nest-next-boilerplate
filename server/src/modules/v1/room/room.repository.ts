import { NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { FindOperator, Repository } from 'typeorm'

import { User } from '../../../common/entities'
import { CustomRepository } from '../../../database/typeorm-ex.decorator'
import { RoomDto } from './dto/room.dto'
import { Room } from './room.entity'

@CustomRepository(Room)
export class RoomRepository extends Repository<Room> {

    public async createRoom(dto: RoomDto, owner: User): Promise<Room> {
        const room: Room = new Room({
            name: dto.name,
            description: dto.description,
            visible: dto.visible,
            owner,
            users: [],
            mods: []
        })

        try {
            const newRoom = this.addOwner(owner, room)
            await this.save(newRoom)
            console.log(newRoom)
            return newRoom
        } catch (err) {
            console.log(err)
            throw new UnprocessableEntityException('Something went wrong with saving room')
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
                    visible: true, id
                }
            })
            return room
        } catch (err) {
            throw new NotFoundException('Room with this id does not exist')
        }
    }

    private addOwner(owner: User, room: Room) {
        room.users.push(owner)
        room.mods.push(owner)
        return room
    }
}