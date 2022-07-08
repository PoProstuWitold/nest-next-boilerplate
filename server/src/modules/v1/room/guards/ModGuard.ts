import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { RoomService } from '../room.service'

@Injectable()
export class ModGuard implements CanActivate {
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
        const ownerOrMod = user.id === room.owner || room.mods.includes(user.id)
        if(!ownerOrMod) {
            throw new ForbiddenException(`You are neither mod nor owner of this room`)
        }

        return ownerOrMod
    }
}