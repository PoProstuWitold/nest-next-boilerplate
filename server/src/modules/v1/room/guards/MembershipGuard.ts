import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { RoomService } from '../room.service'

@Injectable()
export class MembershipGuard implements CanActivate {
    constructor(
        private readonly roomService: RoomService
    ) {}
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const roomId = request.params.id
        const user = request.user
        const room = await this.roomService.getRoom(roomId, { relationIds: true })
        const member = room.users.includes(user.id)
        if(!member) {
            throw new ForbiddenException(`You aren't member of this room`)
        }

        return member
    }
}