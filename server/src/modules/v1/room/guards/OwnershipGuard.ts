import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { RoomService } from '../room.service'

@Injectable()
export class OwnershipGuard implements CanActivate {
    constructor(
        private readonly roomService: RoomService
    ) {}
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const roomId = request.params.id || request.params.roomId
        const user = request.user
        const room = await this.roomService.getRoom(roomId, { relationIds: true })
        const owner = user.id === room.owner
        if(!owner) {
            throw new ForbiddenException(`You aren't owner of this room`)
        }

        return owner
    }
}