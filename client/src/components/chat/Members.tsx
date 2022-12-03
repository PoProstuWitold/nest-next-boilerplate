import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'

import { MemberCard } from './MemberCard'
import { useAuthenticatedSocket } from '../../utils/useSocket'
import { RootState } from '../../store/store'


interface MembersProps {}

export const Members: React.FC<MembersProps> = () => {
    let roomState = useSelector((state: RootState) => state.room)
    const { activeRoom } = roomState
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

            if(invitationLink && activeRoom && invitationLink.roomId !== activeRoom.id) {
                setInvitationLink(null)
            }

            return () => {
                socket.off('connect')
                socket.off('disconnect')
                socket.off('error')
            }
        }
    }, [socket, invitationLink, activeRoom])

    const createInvitation = async(room: any) => {
        try {
            const res = await axios.post(`/room/invite/${room.id}`)
            setInvitationLink(res.data)
        } catch (err) {
            
        }
    }

    if(!activeRoom) {
        return <></>
    }

    return (
        <>
            <div className="mx-auto">
                <p className="m-10 mx-auto text-lg font-bold text-center">Chat: {activeRoom.name}</p>
                <div className="relative flex items-center p-3">
                    <div className="relative w-full overflow-y-auto">
                        <div>
                            <button className="w-full btn btn-sm btn-outline" onClick={() => createInvitation(activeRoom)}>Get invitation link</button>
                            {invitationLink &&
                                <div className="p-4 my-10 text-sm font-bold border text-success rounded-xl border-success">
                                    <p className="text-sm">Copy & Send to people you want to invite</p>
                                    <p className="overflow-x-scroll text-sm">{`http://localhost:3000/invite?code=${invitationLink.code}`}</p>
                                </div>
                            }
                        </div>
                        <ul role="list" className="divide-y">
                            { 
                                activeRoom && activeRoom.users.map((user: any, index: number) => {
                                    return (
                                        <div key={index}>
                                            <MemberCard userFromRoom={user} room={activeRoom}/>
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