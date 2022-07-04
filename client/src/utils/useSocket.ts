import { useSelector } from 'react-redux'
import { useSocket } from 'socket.io-react-hook'

import { RootState } from '../store/store'

export const useAuthenticatedSocket = (namespace: string) => {
    let userState = useSelector((state: RootState) => state.user)
    const { user, authenticated } = userState
    const socket = useSocket(namespace, {
        enabled: !!user && authenticated,
        withCredentials: true,
        reconnectionDelayMax: 10000,
        port: 4000,
        host: 'localhost',
        hostname: 'localhost'
    })
    
    return socket
}