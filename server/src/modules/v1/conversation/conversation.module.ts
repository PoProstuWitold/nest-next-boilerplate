import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypeOrmExModule } from '../../../database/typeorm-ex.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ConversationController } from './conversation.controller';
import { Conversation } from './conversation.entity';
import { ConversationRepository } from './conversation.repository';
import { ConversationService } from './conversation.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Conversation]),
        TypeOrmExModule.forCustomRepository([ConversationRepository]),
        UserModule,
        AuthModule
    ],
    controllers: [ConversationController],
    providers: [ConversationService],
    exports: [ConversationService]
})
export class ConversationModule {}