import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, NotContains, Length, Matches, IsEmail } from 'class-validator'

export class CreateAccountDto {

    @ApiProperty({
        required: true,
        example: 'demo@demo.com',
    })
    @IsEmail()
    email: string


    @ApiProperty({
        required: true,
        example: 'demo123',
    })
    @IsNotEmpty()
    @NotContains(' ')
    @Length(6, 100)
    password: string


    @ApiProperty({
        required: true,
        example: 'John',
    })
    @Matches(/^(?!\s*$).+/, {
        message: 'Name can not be empty or whitespace'
    })
    @Length(3, 50)
    firstName: string


    @ApiProperty({
        required: true,
        example: 'Doe',
    })
    @Matches(/^(?!\s*$).+/, {
        message: 'Name can not be empty or whitespace'
    })
    @Length(3, 50)
    lastName: string

    @ApiProperty({
        required: true,
        example: 'JohnDoe2137',
    })
    @IsNotEmpty()
    @Matches(/^[\w](?!.*?\.{2})[\w. ]{1,28}[\w]$/, {
        message: "Display name can include only letters, numbers and space between words and be max 28 characters long"
    })
    displayName: string
}
