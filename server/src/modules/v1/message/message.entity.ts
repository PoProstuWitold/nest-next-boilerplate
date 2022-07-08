import { Column, Entity, JoinColumn, JoinTable, ManyToOne } from 'typeorm'


import { AbstractEntity, User } from '../../../common/entities'
import { Room } from '../room/room.entity'

@Entity()
export class Message extends AbstractEntity<Message> {

    @ManyToOne(() => Room, room => room.messages)
    @JoinTable()
    public room: Room

    @ManyToOne(() => User, user => user.messages)
    @JoinColumn()
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