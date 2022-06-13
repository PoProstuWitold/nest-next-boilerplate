import { Controller, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { Verified as Status } from '../../../common/decorators';
import { AccountStatus } from '../../../common/enums';
import { JwtAuthGuard, VerifiedGuard } from '../../../common/guards';


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
    ) {
        // return this.userService.update({})
    }
}
