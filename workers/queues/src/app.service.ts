import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
    getMessage(): string {
        return `Queue worker is running`
    }
}