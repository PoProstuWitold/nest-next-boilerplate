import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, NotContains, Length } from 'class-validator'

export class PasswordValuesDto {
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
    oldPassword: string

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
    newPassword: string
}