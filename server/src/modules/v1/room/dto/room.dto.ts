import { IsBoolean, IsNotEmpty, IsString, NotContains } from "class-validator"

export class RoomDto {
    @IsNotEmpty({
        message: 'Name cannot be empty or whitespace'
    })
    @NotContains(' ', {
        message: 'Name cannot be empty or whitespace'
    })
    @IsString({
        message: 'Name must be a string'
    })
    public name?: string

    @IsString({
        message: 'Description must be a string'
    })
    public description?: string

    @IsBoolean({
        message: 'Public visibility must be true or false'
    })
    public isPublic?: boolean
}