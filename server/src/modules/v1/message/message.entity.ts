import { Column, Entity, JoinColumn, JoinTable, ManyToOne } from 'typeorm'


import { AbstractEntity, User } from '../../../common/entities'
import { Room } from '../room/entities'
import { Conversation } from '../conversation/conversation.entity'

@Entity()
export class Message extends AbstractEntity<Message> {

    @ManyToOne(() => Room, room => room.messages, { onDelete: 'CASCADE', nullable: true })
    @JoinTable()
    public room: Room

    @ManyToOne(() => Conversation, conversation => conversation.messages, { onDelete: 'CASCADE', nullable: true })
    @JoinTable()
    public conversation: Conversation

    // @Column({
    //     name: 'author_id',
    //     nullable: true 
    // })
    // public authorId: string

    @ManyToOne(() => User, user => user.messages, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn(/* { name: 'author_id' } */)
    public author: User

    @Column({
        name: 'text',
        nullable: false
    })
    public text: string

    @Column({
        type: 'boolean',
        default: false
    })
    public edited: boolean
}