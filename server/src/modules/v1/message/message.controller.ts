import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../../../common/decorators';
import { JwtAuthGuard, VerifiedGuard } from '../../../common/guards';
import { MessageService } from './message.service';
import { User } from '../../../common/entities';
import { MembershipGuard } from '../room/guards/MembershipGuard';
import { CreateMessageDto } from './dto/create-message.dto';


@ApiTags('v1/message')
@Controller({
    path: 'message',
    version: '1'
})
export class MessageController {
    constructor(
        private readonly messageService: MessageService,
    ) {}

    @UseGuards(JwtAuthGuard, VerifiedGuard, MembershipGuard)
    @Get(':roomId')
    async findMessageForRoom(
        @Param('roomId', new ParseUUIDPipe()) roomId: string
    ) {
        return this.messageService.findMessagesForRoom(roomId)
    }

    @UseGuards(JwtAuthGuard, VerifiedGuard, MembershipGuard)
    @Post(':roomId')
    async createMessage(
        @CurrentUser() user: User,
        @Param('roomId', new ParseUUIDPipe()) roomId: string,
        @Body('text') text: string
    ) {
        return this.messageService.create(user, roomId, text)
    }

    @UseGuards(JwtAuthGuard, VerifiedGuard)
    @Get('')
    async getUserMessages(
        @CurrentUser() user: User
    ) {
        return this.messageService.getUserMessages(user)
    }
}
