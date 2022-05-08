import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, NotContains, Length } from 'class-validator'

export class LoginDto {
    @ApiProperty({
        required: false,
        example: 'demo@demo.com',
    })
    @IsNotEmpty({
        message: 'Email cannot be empty or whitespace'
    })
    @IsEmail({
        message: 'Email should be email'
    })
    email: string

    @ApiProperty({
        required: true,
        example: 'demo123',
    })
    @IsNotEmpty({
        message: 'Password cannot be empty or whitespace'
    })
    @NotContains(' ', {
        message: 'Password cannot be empty or whitespace'
    })
    @Length(6, 100, {
        message: 'Password must be between 6 and 100 characters long'
    })
    password: string
}