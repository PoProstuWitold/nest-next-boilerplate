import { IsNotEmpty, IsString } from 'class-validator'

export class CreateMessageDto {
    @IsNotEmpty({
        message: 'Message content cannot be empty or whitespace'
    })
    @IsString()
    text: string
}