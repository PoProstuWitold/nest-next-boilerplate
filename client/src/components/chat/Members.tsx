import { useSelector } from 'react-redux'

import { RootState } from '../../store/store'
import { useAuthenticatedSocket } from '../../utils/useSocket'
import { useEffect } from 'react'
import { MemberCard } from './MemberCard'

interface MembersProps {
    room: any
}

export const Members: React.FC<MembersProps> = ({ room }) => {
    const { socket } = useAuthenticatedSocket('ws://localhost:4000/chat')
    
    let userState = useSelector((state: RootState) => state.user)
    const { user, authenticated } = userState
    

    useEffect(() => {
        if(socket) {
            socket.on('connect', () => {
                console.log('Socket connected')
            })
          
            socket.on('disconnect', () => {
                console.log('Socket disconnected')
            })

            return () => {
                socket.off('connect')
                socket.off('disconnect')
                socket.off('error')
            }
        }
    }, [socket])

    return (
        <>
            <div className="mx-auto w-96">
                <p className="m-10 mx-auto text-lg font-bold text-center">Chat: {room.name}</p>
                <div className="relative flex items-center p-3">
                    <div className="relative w-full overflow-y-auto h-[40rem]">
                        <ul role="list" className="divide-y">
                            { 
                                room && room.users.map((user: any, index: number) => {
                                    return (
                                        <div key={index}>
                                            <MemberCard userFromRoom={user} room={room}/>
                                        </div>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}