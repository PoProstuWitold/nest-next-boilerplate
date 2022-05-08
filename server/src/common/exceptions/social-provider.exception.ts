import { HttpException, HttpStatus } from '@nestjs/common'

export class SocialProvider extends HttpException {
    constructor() {
        super({
            statusCode: 400,
            message: 'Registered with social provider', 
            errors: {
                password: 'This user was already registered with social provider',
                email: 'This user was already registered with social provider'
            }
        }, HttpStatus.BAD_REQUEST)
    }
}