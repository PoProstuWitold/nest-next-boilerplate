import { Repository } from 'typeorm'

import { CustomRepository } from '../../../database/typeorm-ex.decorator'
import { Conversation } from './conversation.entity'
import { User } from '../../../common/entities'

@CustomRepository(Conversation)
export class ConversationRepository extends Repository<Conversation> {
    public async createConversation(creator: User, recipient: User): Promise<Conversation> {
        const room: Conversation = new Conversation({
            creator,
            recipient
        })

        try {
            await this.save(room)
            return room
        } catch (err) {
            throw err
        }
    }
}