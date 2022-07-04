import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';


export const pubClient = new Redis({ host: 'redis-main', port: 6379})
const subClient = pubClient.duplicate()

export class RedisIoAdapter extends IoAdapter {
    private adapterConstructor: ReturnType<typeof createAdapter>

    async connectToRedis(): Promise<void> {

        await Promise.all([pubClient, subClient])

        this.adapterConstructor = createAdapter(pubClient, subClient)
    }

    createIOServer(port: number, options?: ServerOptions): any {
        const server = super.createIOServer(port, options)
        server.adapter(this.adapterConstructor)
        return server
    }
}