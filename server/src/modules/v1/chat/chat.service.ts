import { Injectable } from '@nestjs/common'
import { Socket } from 'socket.io'
import { parse } from 'cookie'
import { WsException } from '@nestjs/websockets'

import { AuthService } from '../auth/auth.service'
 
@Injectable()
export class ChatService {
    constructor(
        private readonly authService: AuthService
    ) {}
    
    async getUserFromSocket(socket: Socket) {
        try {
            const cookie = socket.handshake.headers.cookie

            if(!cookie) {
                throw new WsException('No cookies found')
            }

            const { access_token: accessToken } = parse(cookie)
            const user = await this.authService.getUserFromAccessToken(accessToken)
            
            if (!user) {
                throw new WsException('Invalid credentials')
            }

            return user
        } catch (err) {
        }
    }
    
}