import { HttpException, HttpStatus } from '@nestjs/common'

export class UniqueViolation extends HttpException {
    constructor(field: string) {
        super({
            statusCode: 400,
            message: 'Unique violation', 
            errors: {
                [field]: `Field ${field} already exists`
            }
        }, HttpStatus.BAD_REQUEST)
    }
}
