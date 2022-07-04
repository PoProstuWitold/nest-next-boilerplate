import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        ChatModule
    ]
})
export class V1Module {}
