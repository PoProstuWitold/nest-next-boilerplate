import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../../../common/decorators';
import { JwtAuthGuard, VerifiedGuard } from '../../../common/guards';
import { User } from '../../../common/entities';
import { ConversationService } from './conversation.service';
import { Throttle } from '@nestjs/throttler'


@ApiTags('v1/conversation')
@Controller({
    path: 'conversation',
    version: '1'
})
export class ConversationController{
    constructor(
        private readonly conversationService: ConversationService,
    ) {}


    @UseGuards(JwtAuthGuard)
    @Get()
    async getConversations() {
        return this.conversationService.getConversations()
    }

    @UseGuards(JwtAuthGuard, VerifiedGuard)
    @Get(':id')
    async getConversation(
        @Param('id', new ParseUUIDPipe()) id: string
    ) {
        return this.conversationService.getConversation(id)
    }

    @UseGuards(JwtAuthGuard, VerifiedGuard)
    @Throttle(60, 60)
    @Get('my/conversations')
    async getUserConversations(
        @CurrentUser('id', new ParseUUIDPipe()) userId: string,
    ) {
        return this.conversationService.getUserConversations(userId)
    }

    @UseGuards(JwtAuthGuard, VerifiedGuard)
    @Post()
    async createConversation(
        @CurrentUser() user: User,
        @Body() data: any
    ) {
        return this.conversationService.createConversation(data, user)
    }
}
