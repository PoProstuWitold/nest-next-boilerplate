import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { TbDots } from 'react-icons/tb'
import axios from 'axios'

import { RootState } from '../../store/store'
import { isRoomMember, isRoomMod, isRoomOwner } from '../../utils/room'
import { useAuthenticatedSocket } from '../../utils/useSocket'
import { User } from '../../utils/types'


interface MemberCardProps {
    userFromRoom: any
    room: any
}

export const MemberCard: React.FC<MemberCardProps> = ({ userFromRoom, room }) => {

    let userState = useSelector((state: RootState) => state.user)
    const { user } = userState
    const { socket } = useAuthenticatedSocket('ws://localhost:4000/chat')
    const isMe = (userOne: any, userTwo: any) => {
        return userOne.id === userTwo.id
    }

    if(!user) {
        return <></>
    }

    useEffect(() => {
        if(socket) {
            socket.on('connect', () => {
                console.log('Socket connected')
            })
          
            socket.on('disconnect', () => {
                console.log('Socket disconnected')
            })

            socket.on('error:room-edit', async (error) => {
                console.log('error:room-edit', error)
            })

            return () => {
                socket.off('connect')
                socket.off('disconnect')
                socket.off('error')
            }
        }
    }, [socket])

    const sendMessage = async (userFromRoom: User) => {
        try {
            const values = {
                creator: user.displayName,
                participant: userFromRoom.displayName
            }
            socket.emit('conversation:create', values)
        } catch (err) {
            console.error(err)
        }
    }

    const showProfile = async () => {
        try {
            // TO DO
            // Create profile page
            console.log('showing profile')
        } catch (err) {
            console.error(err)
        }
    }

    const giveMod = async () => {
        try {
            await axios.post(`/room/add-user/${room.id}`, {
                userId: userFromRoom.id,
                type: 'mod'
            })
            socket.emit('room:members')
        } catch (err) {
            console.error(err)
        }
    }

    const takeMod = async () => {
        try {
            await axios.delete(`/room/remove-user/${room.id}`, {
                data: {
                    userId: userFromRoom.id,
                    type: 'mod'
                }
            })
            socket.emit('room:members')
        } catch (err) {
            console.error(err)
        }
    }

    const kickUser = async () => {
        try {
            await axios.delete(`/room/remove-user/${room.id}`, {
                data: {
                    userId: userFromRoom.id,
                    type: 'user'
                }
            })
            socket.emit('room:members')
        } catch (err) {
            console.error(err)
        }
    }

    
    return (
        <>
            <li className="pt-3 pb-0 sm:pt-4">
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                        <div className="avatar">
                            <div className="w-20 mask mask-squircle">
                                <img src={userFromRoom.image} alt="avatar"/>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex tooltip" data-tip={userFromRoom.displayName}>
                            <p className="text-lg font-medium truncate">{userFromRoom.displayName}</p>
                            {isMe(user, userFromRoom) && <p>(you)</p>}
                        </div>
                        <span className="text-sm">
                            {isRoomOwner(room, userFromRoom) && <p>Role: Owner</p>}
                            {!isRoomOwner(room, userFromRoom) && isRoomMod(room, userFromRoom) && <p>Role: Mod</p>}
                            {!isRoomOwner(room, userFromRoom) && !isRoomMod(room, userFromRoom) && isRoomMember(room, userFromRoom) && <p>Role: Member</p>}
                        </span>
                    </div>
                    <div className="dropdown dropdown-left">
                        <label tabIndex={0} className="m-1 btn btn-md btn-ghost"><TbDots className="text-xl"/></label>
                        <ul tabIndex={0} className="p-2 shadow dropdown-content menu bg-base-200 rounded-box w-52">
                            {!isMe(user, userFromRoom) &&
                                <li>
                                    <button onClick={() => sendMessage(userFromRoom)}>Send message</button>
                                </li>
                            }
                            <li>
                                <button onClick={() => showProfile()}>Profile</button>
                            </li>
                            {!isRoomMod(room, userFromRoom) && isRoomMod(room, user) && !isRoomOwner(room, userFromRoom) && !isMe(user, userFromRoom) &&
                                <li>
                                    <button onClick={() => kickUser()}>Kick</button>
                                </li>
                            }
                            {!isRoomMod(room, userFromRoom) && !isRoomOwner(room, userFromRoom) && !isMe(user, userFromRoom) && isRoomOwner(room, user) &&
                                <li>
                                    <button onClick={() => giveMod()}>Give mod</button>
                                </li>
                            }
                            {isRoomMod(room, userFromRoom) && isRoomMod(room, user) && !isRoomOwner(room, userFromRoom) && !isMe(user, userFromRoom) &&
                                <li>
                                    <button onClick={() => takeMod()}>Take mod</button>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
            </li>
        </>
    )
}