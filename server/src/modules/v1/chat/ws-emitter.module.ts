import { DynamicModule, Global, Inject, Module, ModuleMetadata, Provider } from '@nestjs/common';
import { Emitter, EmitterOptions } from '@socket.io/redis-emitter'
import Redis from 'ioredis';

export const EMITTER_OPTIONS = 'SOCKETIO_REDIS_OPTIONS';
export const EMITTER = 'SOCKETIO_REDIS_EMITTER'

export interface WsEmitterClientOptions extends EmitterOptions {
    config: {
        host: string
        port: number
    }
}

export interface WsEmitterModuleOptions extends ModuleMetadata {
    inject?: any[];
    useFactory?: (...args: any) => Promise<WsEmitterClientOptions>;
}

export function createEmitterOptions(options: WsEmitterModuleOptions): Provider {
    return {
        provide: EMITTER_OPTIONS,
        inject: options.inject,
        useFactory: options.useFactory
    }
}

export function createEmitterInstance(): Provider {
    return {
        provide: EMITTER,
        inject: [EMITTER_OPTIONS],
        useFactory: async (options: WsEmitterClientOptions) => {
            return await new Emitter(new Redis({
                host: options.config.host,
                port: options.config.port
            }))
        },
        
    }
}

export const InjectEmitter = () => Inject(EMITTER)

@Global()
@Module({})
export class WsEmitterModule {
    static registerAsync(options?: WsEmitterModuleOptions): DynamicModule {
        const providerOptions = createEmitterOptions(options)
        const emitter = createEmitterInstance();

        return {
            module: WsEmitterModule,
            imports: options.imports,
            providers: [providerOptions, emitter],
            exports: [emitter],
        }
    }
}