import { Exclude } from 'class-transformer'
import { BeforeInsert, Column, Entity, Index, ManyToMany, OneToMany } from 'typeorm'
import * as argon2 from 'argon2'

import { AbstractEntity } from './'
import { Providers, AccountStatus, Role } from '../enums'
import { Invitation, Room } from '../../modules/v1/room/entities'
import { Message } from '../../modules/v1/message/message.entity'

@Entity()
export class User extends AbstractEntity<User> {

    @Column({
        name: 'provider',
        nullable: true,
        type: 'enum',
        enum: Providers
    })
    public provider: Providers

    @Index()
    @Column({
        length: 200,
        name: 'provider_id',
        nullable: true
    })
    public providerId: string

    @Index()
    @Column({ 
        unique: true,
        length: 200,
        name: 'email',
        nullable: false
    })
    public email: string

    @Exclude()
    @Column({
        length: 200,
        name: 'password',
        nullable: false
    })
    public password: string

    @Column({
        length: 200,
        name: 'first_name',
        nullable: false
    })
    public firstName: string

    @Column({
        length: 200,
        name: 'last_name',
        nullable: false
    })
    public lastName: string

    @Column({
        unique: true,
        length: 200,
        name: 'nick_name',
        nullable: false
    })
    public displayName: string

    @Column({
        length: 400,
        name: 'image',
        nullable: true,
        default: null
    })
    public image: string

    @Column({
        name: 'role',
        nullable: false,
        default: Role.USER,
        type: 'enum',
        enum: Role
    })
    public role: Role

    @Column({
        name: 'account_status',
        nullable: false,
        default: AccountStatus.PENDING,
        type: 'enum',
        enum: AccountStatus
    })
    public accountStatus: AccountStatus

    @ManyToMany(() => Room, room => room.users)
    public rooms: Room[]

    @OneToMany(() => Message, message => message.author)
    public messages: Message[]

    @OneToMany(() => Invitation, invitation => invitation.user)
    public invitations: Invitation[]

    @BeforeInsert()
    async hashPassword() {
        this.password = await argon2.hash(this.password)
    }
}