import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsBoolean, NotContains, Length } from 'class-validator'

export class LoginDto {
    @ApiProperty({
        required: false,
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
}