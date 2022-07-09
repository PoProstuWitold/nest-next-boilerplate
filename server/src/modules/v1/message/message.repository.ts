import { Repository } from 'typeorm'

import { CustomRepository } from '../../../database/typeorm-ex.decorator'
import { Message } from './message.entity'

@CustomRepository(Message)
export class MessageRepository extends Repository<Message> {}