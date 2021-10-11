import { Controller, Get } from '@nestjs/common'

@Controller()
export class MainController {
    @Get()
    getInfo(): string {
        return 'NestJS NextJS Boilerplate by PoProstuWitold v1'
    }
}