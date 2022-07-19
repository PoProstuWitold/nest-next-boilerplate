import { useAuthenticatedSocket } from '../../utils/useSocket'
import { useEffect, useState } from 'react'
import { MemberCard } from './MemberCard'
import axios from 'axios'

interface MembersProps {
    room: any
}

export const Members: React.FC<MembersProps> = ({ room }) => {
    const { socket } = useAuthenticatedSocket('ws://localhost:4000/chat')
    const [invitationLink, setInvitationLink] = useState<any | null>(null)

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

    const createInvitation = async(room: any) => {
        try {
            const res = await axios.post(`/room/invite/${room.id}`)
            setInvitationLink(res.data)
        } catch (err) {
            
        }
    }

    return (
        <>
            <div className="mx-auto w-96">
                <p className="m-10 mx-auto text-lg font-bold text-center">Chat: {room.name}</p>
                <div className="relative flex items-center p-3">
                    <div className="relative w-full overflow-y-auto h-[40rem]">
                        <div>
                            <button className="w-full btn btn-sm btn-outline" onClick={() => createInvitation(room)}>Get invitation link</button>
                            {invitationLink &&
                                <div className="p-4 my-10 text-sm font-bold border text-success rounded-xl border-success">
                                    <p className="text-sm">Copy & Send to people you want to invite</p>
                                    <p className="overflow-x-scroll text-sm">{`http://localhost:3000/invite?code=${invitationLink.code}`}</p>
                                </div>
                            }
                        </div>
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