import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator } from 'typeorm';

import { User } from '../../../common/entities';
import { RoomService } from '../room/room.service';
import { MessageRepository } from './message.repository';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(MessageRepository) 
        private readonly messageRepository: MessageRepository,
        private readonly roomService: RoomService
    ) {}


    public async getUrls(text: string) {
        const exp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?!&//=]*)/gi
        const result = text.match(exp)

        if (!result) {
            return []
        }

        return Array.from(result)
    }

    public async getUserMessages(user: any | FindOperator<User>) {
        try {
            // return this.messageRepository.find({ relations: ['author'] })
            const query = await this.messageRepository
                .createQueryBuilder('message')
                .where('author.id = :authorId', { authorId: user.id })
                .leftJoinAndSelect('message.author', 'author')
                .leftJoinAndSelect('message.room', 'room')
                .select([
                    'message',
                    'author.id',
                    'author.displayName',
                    'room.id',
                    'room.name'
                ])
                .orderBy('message.created_at', 'DESC')
                .getMany()
            return query
        } catch (err) {
            console.error(err)
        }
    }

    public async create(user: User | null, roomId: string, text: string) {
        try {
            const room = await this.roomService.getRoom(roomId, { relationIds: false })

            // const urls = await this.getUrls(text)
            // console.log('urls', urls)
            if(user) {
                const message = this.messageRepository.create({
                    author: user,
                    room,
                    text
                })
                return this.messageRepository.save(message)
            }
            if(!user) {
                const message = this.messageRepository.create({
                    room,
                    text
                })
                return this.messageRepository.save(message)
            }
            // const message = await this.messageRepository
            //     .createQueryBuilder('message')
            //     .insert()
            //     .into(Message)
            //     .values({
            //         author: user,
            //         room,
            //         text: data.text
            //     })
            //     .execute()
            //     return message.raw
        } catch (err) {
            console.error(err)
        }
    }


    async findMessagesForRoom(roomId: string): Promise<any> {
        const room = await this.roomService.getRoom(roomId, { relationIds: true })
        const query = await this.messageRepository
            .createQueryBuilder('message')
            .leftJoin('message.room', 'room')
            .where('room.id = :roomId', { roomId: room.id })
            .leftJoinAndSelect('message.author', 'author')
            .select([
                'message',
                'author.id',
                'author.displayName',
                'room.id',
                'room.name'
            ])
            .orderBy('message.created_at', 'ASC')
            .getMany()
    
        return query
    }

}
