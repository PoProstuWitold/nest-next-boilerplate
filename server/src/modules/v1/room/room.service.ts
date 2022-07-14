import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Emitter } from '@socket.io/redis-emitter';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { User } from '../../../common/entities';
import { PostgresErrorCode } from '../../../common/enums';
import { UniqueViolation } from '../../../common/exceptions';
import { InjectEmitter } from '../chat/ws-emitter.module';
import { UserService } from '../user/user.service';
import { Room } from './room.entity';
import { RoomRepository } from './room.repository';

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(RoomRepository) 
        private readonly roomRepository: RoomRepository,
        private readonly userService: UserService,
        @InjectEmitter() private readonly emitter: Emitter 
    ) {}


    public async createRoom(dto: Partial<Room>, owner: User) {
        try {
            console.log(owner.id)
            const room = await this.roomRepository.createRoom(dto, owner)
            return room
        } catch (err) {
            if(err.code == PostgresErrorCode.UniqueViolation) {
                if(err.detail.includes('name')) {
                    throw new UniqueViolation('name')
                }
            }
        }
    }

    public async getRooms() {
        return this.roomRepository.find({
            // relations: [
            //     'owner', 'users', 'mods'
            // ],
            loadRelationIds: true,
            // where: {
            //     isPublic: true
            // }
        })
    }

    public async getUserRooms(userId: string) {
        const query = await this.roomRepository
            .createQueryBuilder('room')
            .where('users.id = :userId', { userId })
            .leftJoin('room.users', 'users')
            .leftJoinAndSelect('room.users', 'all_users')
            .leftJoinAndSelect('room.mods', 'mods')
            .leftJoinAndSelect('room.owner', 'owner')
            .select([
                'room',
                'all_users.id',
                'all_users.displayName',
                'all_users.image',
                'mods.id',
                'mods.displayName',
                'mods.image',
                'owner.id',
                'owner.displayName',
                'owner.image',
            ])
            .orderBy('room.updated_at', 'DESC')
            .getMany()

        return query
    }

    public async getRoom(id: string, { relationIds }: { relationIds: boolean }) {
        return this.roomRepository.getRoom(id, relationIds)
    }

    public async getRoomWithRelations(id: string) {
        const query = await this.roomRepository
            .createQueryBuilder('room')
            .where("room.id = :id", { id })
            .leftJoin('room.users', 'users')
            .leftJoinAndSelect('room.users', 'all_users')
            .leftJoinAndSelect('room.mods', 'mods')
            .leftJoinAndSelect('room.owner', 'owner')
            .select([
                'room',
                'all_users.id',
                'all_users.displayName',
                'all_users.image',
                'mods.id',
                'mods.displayName',
                'mods.image',
                'owner.id',
                'owner.displayName',
                'owner.image',
            ])
            .orderBy('room.updated_at', 'DESC')
            .getOne()

        return query
    }

    public async getRoomForMessages(id: string) {
        return this.roomRepository.findOneOrFail({
            where: { id },
            relations: [
                'users', 'mods', 'owner'
            ]
        })
    }

    public async updateRoom(id: string, values: QueryDeepPartialEntity<Room>) {
        try {
            const room = await this.roomRepository
                .createQueryBuilder()
                .update(Room)
                .set(values)
                .where("id = :id", { id })
                .execute()

            return {
                success: !!room.affected,
                message: !!room.affected ? 'Room updated' : 'No room found with this id',
            }
        } catch (err) {
            if(err.code == PostgresErrorCode.UniqueViolation) {
                if(err.detail.includes('name')) {
                    throw new UniqueViolation('name')
                }
            }
            throw new InternalServerErrorException()
        }
    }

    public async deleteRoom(id: string) {
        try {
            const room = await this.roomRepository
                .createQueryBuilder()
                .delete()
                .where("id = :id", { id })
                .execute()

            return {
                success: !!room.affected,
                message: !!room.affected ? 'Room deleted' : 'No room found with this id',
            }
        } catch (err) {
            throw err
        }
    }

    public async addToRoom(type: 'user' | 'mod', userId: string, roomId: string) {
        const room = await this.roomRepository.getRoom(roomId, true)
        const user = await this.userService.getUserByField('id', userId)

        //@ts-ignore
        const isUser = room.users.includes(user.id)
        //@ts-ignore
        const isMod = room.mods.includes(user.id)

        if(type === 'user') {
            if(!isUser) {
                await this.roomRepository
                    .createQueryBuilder()
                    .relation(Room, 'users')
                    .of(room)
                    .add(user)

                    const rooms = await this.getUserRooms(user.id)

                    this.emitter.of('/chat').to(user.id).emit('room:all', rooms)
                return {
                    success: true,
                    message: 'User added to room'
                }
            } 

            return {
                success: false,
                message: 'User not added to room'
            }
        }

        

        if(type === 'mod') {
            if(!isMod) {
                await this.roomRepository
                .createQueryBuilder()
                .relation(Room, 'mods')
                .of(room)
                .add(user)
    
                return {
                    success: true,
                    message: 'User added to moderators'
                }
            }

            //@ts-ignore
            if(!isUser) {
                await this.roomRepository
                .createQueryBuilder()
                .relation(Room, 'users')
                .relation(Room, 'mods')
                .of(room)
                .add(user)
    
                return {
                    success: true,
                    message: 'User added to room and moderators'
                }
            }

            return {
                success: false,
                message: 'User not added to room and moderators'
            }
        }
    }

    public async removeFromRoom(type: 'user' | 'mod', userId: string, roomId: string) {
        const room = await this.roomRepository.getRoom(roomId, true)
        const user = await this.userService.getUserByField('id', userId)

        //@ts-ignore
        const isUser = room.users.includes(user.id)
        //@ts-ignore
        const isMod = room.mods.includes(user.id)
        //@ts-ignore
        const isOwner = user.id === room.owner

        if(isOwner) {
            return {
                success: false,
                message: "Owner cannot be removed from their room"
            }
        }

        if(type === 'user') {
            if(isUser) {
                await this.roomRepository
                    .createQueryBuilder()
                    .relation(Room, 'users')
                    .of(room)
                    .remove(user)

                    const rooms = await this.getUserRooms(user.id)

                    this.emitter.of('/chat').to(user.id).emit('room:all', rooms)
                return {
                    success: true,
                    message: 'User removed from room'
                }
            } 

            if(isMod) {
                await this.roomRepository
                    .createQueryBuilder()
                    .relation(Room, 'users')
                    .relation(Room, 'mods')
                    .of(room)
                    .remove(user)

                return {
                    success: true,
                    message: 'User removed from room and moderators'
                }
            } 

            return {
                success: false,
                message: 'User not removed from room'
            }
        }

        

        if(type === 'mod') {
            if(isMod) {
                await this.roomRepository
                    .createQueryBuilder()
                    .relation(Room, 'mods')
                    .of(room)
                    .remove(user)
    
                return {
                    success: true,
                    message: 'User removed from moderators'
                }
            }

            return {
                success: false,
                message: 'User not removed from moderators'
            }
        }
        

        
    }
}
