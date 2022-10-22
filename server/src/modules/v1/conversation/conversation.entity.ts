import { Entity, Index, JoinColumn, OneToMany, OneToOne } from 'typeorm'


import { AbstractEntity, User } from '../../../common/entities'
import { Message } from '../message/message.entity';

@Entity()
@Index(['creator.id', 'recipient.id'], { unique: true })
export class Conversation extends AbstractEntity<Conversation> {

    @OneToOne(() => User, { createForeignKeyConstraints: false })
    @JoinColumn()
    public creator: User;

    @OneToOne(() => User, { createForeignKeyConstraints: false })
    @JoinColumn()
    public recipient: User

    @OneToMany(() => Message, (message) => message.conversation, {
        cascade: ['insert', 'remove', 'update'],
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    public messages: Message[]
}