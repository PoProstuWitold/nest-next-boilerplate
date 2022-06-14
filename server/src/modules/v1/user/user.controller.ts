import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { CurrentUser, Verified as Status } from '../../../common/decorators';
import { AccountStatus } from '../../../common/enums';
import { JwtAuthGuard, VerifiedGuard } from '../../../common/guards';
import { UpdateUserDto } from '../../../common/dtos';


@ApiTags('v1/user')
@Controller({
    path: 'user',
    version: '1'
})
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}
    @Status(AccountStatus.VERIFIED)
    @UseGuards(JwtAuthGuard, VerifiedGuard)
    @Patch('update')
    updateProfile(
        @CurrentUser('id') id: string,
        @Body() updateData: UpdateUserDto
    ) {
        return this.userService.updateProfile(id, updateData)
    }
}
