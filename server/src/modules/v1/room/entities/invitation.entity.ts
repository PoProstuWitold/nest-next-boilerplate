import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from 'typeorm'


import { AbstractEntity, User } from '../../../../common/entities'
import { Room } from './room.entity';

@Entity()
export class Invitation extends AbstractEntity<Invitation> {

    @Column({
        nullable: false,
        name: 'code'
    })
    public code: string

    @Column({
        nullable: false,
        name: 'user_id'
    })
    public userId: string

    @ManyToOne(() => User, user => user.invitations)
    @JoinColumn({ name: 'user_id' })
    public user: User

    @Column({
        nullable: false,
        name: 'room_id'
    })
    public roomId: string

    @ManyToOne(() => Room)
    @JoinColumn({ name: 'room_id' })
    public room: Room

    @Column({
        type: 'timestamp without time zone',
        name: 'expires_at',
        nullable: true
    })
    public expiresAt: Date

}