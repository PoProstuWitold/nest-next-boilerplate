import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm'


import { AbstractEntity, User } from '../../../common/entities'
import { JoinedRoom } from '../chat/entites';
import { Message } from '../message/message.entity';

@Entity()
export class Room extends AbstractEntity<Room> {

    @Column({
        unique: true
    })
    public name: string

    @Column({
        nullable: true
    })
    public description: string

    @Column({
        type: 'boolean',
        default: true
    })
    public isPublic: boolean

    @ManyToMany(() => User)
    @JoinTable()
    public users: User[]

    @OneToMany(() => JoinedRoom, joinedRoom => joinedRoom.room, { onDelete: 'CASCADE' })
    public joinedUsers: JoinedRoom[]

    @ManyToMany(() => User)
    @JoinTable()
    public mods: User[]

    @ManyToOne(() => User)
    public owner: User

    @OneToMany(() => Message, message => message.room, { onDelete: 'CASCADE' })
    public messages: Message[]
}