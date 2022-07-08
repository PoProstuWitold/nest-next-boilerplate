import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { Room } from '../../room/room.entity';
import { AbstractEntity, User } from '../../../../common/entities'

@Entity()
export class JoinedRoom extends AbstractEntity<User> {
    @Column()
    public socketId: string

    @ManyToOne(() => User, user => user.joinedRooms)
    @JoinColumn()
    public user: User;

    @ManyToOne(() => Room, room => room.joinedUsers)
    @JoinColumn()
    public room: Room
}