import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { instanceToPlain } from 'class-transformer'
  
export abstract class AbstractEntity<T> {

    constructor(partial: Partial<T>) {
        Object.assign(this, partial)
    }

    @PrimaryGeneratedColumn('uuid')
    public id: string
  
    @CreateDateColumn({
        type: 'timestamp without time zone',
        name: 'created_at'
    })
    public createdAt: Date
  
    @UpdateDateColumn({
        type: 'timestamp without time zone',
        name: 'updated_at',
    })
    public updatedAt: Date

    toJSON() {
        return instanceToPlain(this)
    }
}