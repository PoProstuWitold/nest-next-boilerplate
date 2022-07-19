import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../../../common/decorators';
import { User } from '../../../common/entities';
import { JwtAuthGuard, VerifiedGuard } from '../../../common/guards';
import { ModGuard } from './guards/ModGuard';
import { OwnershipGuard } from './guards/OwnershipGuard';
import { RoomDto } from './dto/room.dto';
import { RoomService } from './room.service';
import { AddRemoveUserDto } from './dto/add-remove-user.dto';
import { MembershipGuard } from './guards/MembershipGuard';


@ApiTags('v1/room')
@Controller({
    path: 'room',
    version: '1'
})
export class RoomController {
    constructor(
        private readonly roomService: RoomService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get('invitation')
    async getInvitations(
        @Query('code') code: string
    ) {
        console.log(code)
        return this.roomService.getInvitationByCode(code)
    }

    @UseGuards(JwtAuthGuard)
    @Get('invitations')
    async getInvitation() {
        return this.roomService.getInvitations()
    }

    @UseGuards(JwtAuthGuard, MembershipGuard)
    @Post('invite/:roomId')
    async inviteToRoom(
        @CurrentUser('id') userId: string,
        @Param('roomId', new ParseUUIDPipe()) roomId: string
    ) {
        return this.roomService.inviteToRoom(userId, roomId)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getRooms() {
        return this.roomService.getRooms()
    }

    @UseGuards(JwtAuthGuard, VerifiedGuard, MembershipGuard)
    @Get(':id')
    async getRoom(
        @Param('id', new ParseUUIDPipe()) id: string
    ) {
        return this.roomService.getRoomWithRelations(id)
    }

    @UseGuards(JwtAuthGuard, VerifiedGuard)
    @Get('my/rooms')
    async getUsersRoom(
        @CurrentUser('id', new ParseUUIDPipe()) userId: string,
    ) {
        return this.roomService.getUserRooms(userId)
    }

    @UseGuards(JwtAuthGuard, VerifiedGuard)
    @Post()
    async createRoom(
        @CurrentUser() user: User,
        @Body() data: RoomDto
    ) {
        return this.roomService.createRoom(data, user)
    }


    @UseGuards(JwtAuthGuard, VerifiedGuard, ModGuard)
    @Patch(':id')
    async updateRoom(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() data: RoomDto
    ) {
        return this.roomService.updateRoom(id, data)
    }

    @UseGuards(JwtAuthGuard, VerifiedGuard, OwnershipGuard)
    @Delete(':id')
    async deleteRoom(
        @Param('id', new ParseUUIDPipe()) id: string
    ) {
        return this.roomService.deleteRoom(id)
    }

    @UseGuards(JwtAuthGuard)
    @Post('add-user/:roomId')
    async addUser(
        @Body() data: AddRemoveUserDto,
        @Param('roomId', new ParseUUIDPipe()) roomId: string
    ) {
        return this.roomService.addToRoom(data.type, data.userId, roomId)
    }

    @UseGuards(JwtAuthGuard, MembershipGuard, VerifiedGuard, ModGuard)
    @Delete('remove-user/:roomId')
    async removeUser(
        @Body() data: AddRemoveUserDto,
        @Param('roomId', new ParseUUIDPipe()) roomId: string
    ) {
        return this.roomService.removeFromRoom(data.type, data.userId, roomId)
    }
}
