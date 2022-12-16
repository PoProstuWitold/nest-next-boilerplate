import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { PostgresErrorCode } from '../../../common/enums';
import { UniqueViolation } from '../../../common/exceptions';
import { User } from '../../../common/entities';
import { Conversation } from './conversation.entity'

@Injectable()
export class ConversationService {
    constructor(
        @InjectRepository(Conversation) 
        private readonly conversationRepository: Repository<Conversation>
    ) {}

    public async getConversations() {
        return this.conversationRepository.find({
            loadRelationIds: true
        })
    }

    public async getConversation(id: string) {
        return this.conversationRepository.findOne({ where: { id } })
    }

    public async getUserConversations(userId: string) {
        const query = await this.conversationRepository
            .createQueryBuilder('conversation')
            .where("creator.id = :userId", { userId })
            .orWhere("recipient.id = :userId", { userId })
            .leftJoinAndSelect('conversation.creator', 'creator')
            .leftJoinAndSelect('conversation.recipient', 'recipient')
            .select([
                'conversation',
                'creator.id',
                'creator.displayName',
                'creator.image',
                'recipient.id',
                'recipient.displayName',
                'recipient.image'
            ])
            .orderBy('conversation.updated_at', 'DESC')
            .getMany()

        return query
    }

    public async createConversation(creator: User, recipient: User) {
        try {
            // const conversation = await this.conversationRepository.createConversation(creator, recipent)
            const conversation = new Conversation({
                creator,
                recipient
            })

            await this.conversationRepository.save(conversation)
            return conversation
        } catch (err) {
            if(err.code == PostgresErrorCode.UniqueViolation) {
                if(err.detail.includes('name')) {
                    throw new UniqueViolation('name')
                }
            }
        }
    }

    public async findIfExists(user1: any, user2: any) {
        try {
            const existingConversation = await this.conversationRepository
                .createQueryBuilder('conversation')
                .where(
                    new Brackets((qb) => {
                        qb
                        .where("creator.displayName = :user1", { user1 })
                        .andWhere("recipient.displayName = :user2", { user2 })
                    })
                )
                .orWhere(
                    new Brackets((qb) => {
                        qb
                        .where("creator.displayName = :user2", { user2 })
                        .andWhere("recipient.displayName = :user1", { user1 })
                    })
                )
                .leftJoinAndSelect('conversation.creator', 'creator')
                .leftJoinAndSelect('conversation.recipient', 'recipient')
                .select([
                    'conversation',
                    'creator.id',
                    'creator.displayName',
                    'creator.image',
                    'recipient.id',
                    'recipient.displayName',
                    'recipient.image'
                ])
                .getOne()

            if(!existingConversation) {
                return null                
            }
            
            return existingConversation
        } catch (err) {
            throw err
        }
    }
}
