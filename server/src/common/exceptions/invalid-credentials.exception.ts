import { HttpException, HttpStatus } from '@nestjs/common'

export class InvalidCredentials extends HttpException {
    constructor() {
        super({
            statusCode: 400,
            message: 'Invalid credentials', 
            errors: {
                password: 'Invalid credentials',
                email: 'Invalid credentials'
            }
        }, HttpStatus.BAD_REQUEST)
    }
}