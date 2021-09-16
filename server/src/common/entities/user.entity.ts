import { Exclude } from 'class-transformer'
import { BeforeInsert, Column, Entity, Index } from 'typeorm'
import { AbstractEntity } from './'
import * as argon2 from 'argon2'

@Entity()
export class User extends AbstractEntity<User> {

    @Index()
    @Column({ 
        unique: true,
        length: 75,
        name: 'email',
        nullable: false
    })
    public email: string

    @Exclude()
    @Column({
        length: 75,
        name: 'password',
        nullable: false
    })
    public password: string

    @Column({
        length: 75,
        name: 'first_name',
        nullable: false
    })
    public firstName: string

    @Column({
        length: 75,
        name: 'last_name',
        nullable: false
    })
    public lastName: string

    @Column({
        unique: true,
        length: 75,
        name: 'nick_name',
        nullable: false
    })
    public nickName: string

    @BeforeInsert()
    async hashPassword() {
        this.password = await argon2.hash(this.password)
    }
}