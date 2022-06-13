import { Injectable } from '@nestjs/common'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'

import { User } from '../common/entities';

@Injectable()
export class DatabaseOptions implements TypeOrmOptionsFactory {

    public createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            entities: [User]
        }
    }
}