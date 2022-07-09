import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { AbstractEntity, User } from '../../../../common/entities'

@Entity()
export class ConnectedUser extends AbstractEntity<User> {
    @Column()
    public socketId: string;

    @ManyToOne(() => User, user => user.connections, { onDelete: 'CASCADE' })
    @JoinColumn()
    public user: User
}