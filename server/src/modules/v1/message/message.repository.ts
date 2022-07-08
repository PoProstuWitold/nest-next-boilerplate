import { Repository } from 'typeorm'
import { UnprocessableEntityException } from '@nestjs/common'

import { CustomRepository } from '../../../database/typeorm-ex.decorator'
import { CreateMessageDto } from './dto/create-message.dto'
import { Message } from './message.entity'
import { User } from '../../../common/entities'
import { RoomService } from '../room/room.service'

@CustomRepository(Message)
export class MessageRepository extends Repository<Message> {

    public async createMessage(dto: CreateMessageDto, author: User, room: string): Promise<Message> {
        const message: Message = new Message({
            text: dto.text,
            author
        })

        try {
            await this.save(message)
            console.log(message)
            return message
        } catch (err) {
            console.log(err)
            throw new UnprocessableEntityException('Something went wrong with saving room')
        }
    }
}