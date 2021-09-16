import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsBoolean, NotContains, Length } from 'class-validator'

export class LoginDto {
    @ApiProperty({
        required: false,
        example: 'test@test.com',
    })
    @IsOptional()
    @IsEmail()
    email: string

    @ApiProperty({
        required: false,
        example: 'test_user',
    })
    @IsOptional()
    nickName: string

    @ApiProperty({
        required: true,
        example: true
    })
    @IsBoolean()
    rememberMe: boolean

    @ApiProperty({
        required: true,
        example: 'password',
    })
    @IsNotEmpty()
    @NotContains(' ')
    @Length(6, 100)
    password: string
}