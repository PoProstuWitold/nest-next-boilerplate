import { Exclude } from 'class-transformer'
import { BeforeInsert, Column, Entity, Index } from 'typeorm'
import { AbstractEntity } from './'
import * as argon2 from 'argon2'

@Entity()
export class User extends AbstractEntity<User> {

    @Column({
        length: 200,
        name: 'provider',
        nullable: true
    })
    public provider: string

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

    @BeforeInsert()
    async hashPassword() {
        this.password = await argon2.hash(this.password)
    }
}