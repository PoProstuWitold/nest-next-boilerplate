import { IsNotEmpty, IsUUID } from 'class-validator'

export class AddRemoveUserDto {
    @IsNotEmpty({
        message: 'User ID cannot be empty or whitespace'
    })
    @IsUUID()
    userId: string

    @IsNotEmpty({
        message: 'Type must be either user or mod'
    })
    type: 'user' | 'mod'
}