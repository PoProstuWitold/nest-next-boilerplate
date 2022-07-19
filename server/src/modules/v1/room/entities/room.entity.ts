import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm'


import { AbstractEntity, User } from '../../../../common/entities'
import { Message } from '../../message/message.entity';

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

    @ManyToMany(() => User)
    @JoinTable()
    public mods: User[]

    // @Column({
    //     nullable: true,
    //     name: 'owner_id'
    // })
    // public ownerId: string

    @ManyToOne(() => User)
    @JoinColumn(/* { name: 'owner_id' } */)
    public owner: User

    @OneToMany(() => Message, message => message.room, { onDelete: 'CASCADE' })
    public messages: Message[]
}