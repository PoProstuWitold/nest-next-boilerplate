import Head from 'next/head'
import { useDispatch, useSelector } from 'react-redux'
import { FiSettings } from 'react-icons/fi'
import { IoIosPeople} from 'react-icons/io'
import { useEffect, useRef, useState } from 'react'

import { ChatButton } from '../../components/chat/ChatButton'
import { Message } from '../../components/chat/Message'
import { MessageInput } from '../../components/chat/MessageInput'
import { Dispatch, RootState } from '../../store/store'
import { AuthOption, withAuth } from '../../utils/withAuth'
import { useAuthenticatedSocket } from '../../utils/useSocket'
import { CreateChatForm } from '../../components/chat/CreateChatForm'
import { EditChatForm } from '../../components/chat/EditChatForm'
import { Members } from '../../components/chat/Members'
import { isRoomMod } from '../../utils/room'
import { Room } from '../../utils/types'

interface ChatProps {

}


const Chat: React.FC<ChatProps> = ({}) => {

    const dispatch = useDispatch<Dispatch>()

    let userState = useSelector((state: RootState) => state.user)
    const { user } = userState

    let roomState = useSelector((state: RootState) => state.room)
    const { rooms, activeRoom } = roomState
    const messagesEndRef = useRef<null | HTMLDivElement>(null)
    const { socket } = useAuthenticatedSocket('ws://localhost:4000/chat')

    const [messages, setMessages] = useState<any>('')
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    
    useEffect(() => {
        socket.emit('room:all')
        socket.on('room:all', async (rooms) => {
            await dispatch.room.setRooms()
            if(!rooms.length) {
                setMessages('')
                dispatch.room.setActiveRoom(null)
            }
            console.log('rooms', rooms)
        })
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        console.log('roomsState', roomState)
    }, [rooms])

    useEffect(() => {
        if(socket) {
            socket.on('connect', () => {
                console.log('Socket connected')
            })
          
            socket.on('disconnect', () => {
                console.log('Socket disconnected')
            })

            socket.on('message:created', async (message) => {
                console.log(message)
                if(activeRoom && message.room.id === activeRoom.id) {
                    setMessages((messages: any[]) => [...messages, message])
                }
            })
          
            socket.on('room:all', async (rooms) => {
                await dispatch.room.setRooms()

                if(activeRoom) {
                    const updated = await rooms.find((room: Room) => room.id === activeRoom.id)
                    await dispatch.room.setActiveRoom(updated)
                }
                
                if(!rooms.length) {
                    setMessages('')
                    dispatch.room.setActiveRoom(null)
                }
                console.log('rooms', rooms)
            })
          
            socket.on('room:messages', async (messages) => {
                console.log('messages', messages)
                setMessages(messages)
            })

            return () => {
                socket.off('connect')
                socket.off('disconnect')
                socket.off('message:created')
                socket.off('room:all')
                socket.off('room:messages')
            }
        }
    }, [socket, rooms, activeRoom, user])

    if(!user) {
        return (
            <></>
        )
    }

    const setActiveRoomAndGetMessages = async (room: any ) => {
        socket.emit('room:leave')
        dispatch.room.setActiveRoom(room)
        socket.emit('room:join', ({ roomId: room.id }))
    }

    return (
        <>
            <Head>
                <title>Your chats</title>
                <meta name="description" content="Welcome to Witq"/>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="mx-10 mt-10">
                <div className="shadow-2xl bg-base-200 rounded-xl">
                    <div className="flex flex-col lg:flex-row">
                        <div className="p-5 lg:w-1/3">
                            <div className="shadow-2xl bg-base-200 rounded-xl">
                                <ul className="overflow-auto h-[25rem]">
                                    <div className="inline-flex">
                                        <h2 className="m-2 text-2xl">Chats</h2>
                                        <label htmlFor="create-chat" className="m-2 btn btn-sm">add</label>
                                    </div>
                                    {/* ROOMS */}
                                    <li>
                                        {rooms && rooms.map((room: any, index: number) =>
                                            <div key={index} onClick={() => setActiveRoomAndGetMessages(room)} className={room === activeRoom ? "bg-base-300" : ""}>
                                                <ChatButton room={room} />
                                            </div>
                                        )}
                                    </li>
                                </ul>
                                <ul className="overflow-auto h-[25rem]">
                                    <div className="inline-flex">
                                        <h2 className="m-2 text-2xl">Converastions</h2>
                                        <label htmlFor="create-chat" className="m-2 btn btn-sm">add</label>
                                    </div>
                                    {/* CONVERSATIONS */}
                                    <li>
                                        {/* {rooms && rooms.map((room: any, index: number) =>
                                            <div key={index} onClick={() => setActiveRoomAndGetMessages(room)} className={room === activeRoom ? "bg-base-300" : ""}>
                                                <ChatButton room={room} />
                                            </div>
                                        )} */}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="p-5 lg:w-2/3">
                            <div className="shadow-2xl rounded-xl">
                                <div className="w-full">
                                    {rooms && activeRoom &&
                                        <>
                                            <div className="relative flex items-center p-3 border-b border-primary-focus">
                                                <img className="object-cover w-10 h-10 rounded-full" src="http://simpleicon.com/wp-content/uploads/multy-user.png" alt="username" />
                                                <span className="block ml-2 font-bold">{activeRoom.name}</span>
                                                <label htmlFor="members" className={`ml-2 btn btn-sm btn-ghost font-semibold}`}>
                                                    <IoIosPeople/> <p className="ml-2">Members</p>
                                                </label>
                                                {activeRoom.users && isRoomMod(activeRoom, user) &&
                                                    <>
                                                        <label htmlFor="edit-chat" className={`ml-2 btn btn-sm btn-ghost font-semibold}`}>
                                                            <FiSettings/> <p className="ml-2">Edit</p>
                                                        </label>
                                                    </>
                                                }
                                            </div>
                                            <div className="relative w-full p-6 overflow-y-auto h-[40rem]">
                                                <ul className="space-y-2">
                                                    { 
                                                        messages && messages.map((message: any, index: number, messagesMap: any[]) => {
                                                            const nextMsg = messagesMap[index-1]
                                                            return (
                                                                <div key={index}>
                                                                    {message.author ? <Message msg={message} author={message.author} nextMsg={nextMsg}/> : <Message msg={message} nextMsg={nextMsg}/>}
                                                                </div>
                                                            )
                                                        })
                                                    }

                                                    <div ref={messagesEndRef} />
                                                </ul>
                                            </div>

                                            <MessageInput roomId={activeRoom.id}/>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <input type="checkbox" id="create-chat" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <label htmlFor="create-chat" className="absolute btn btn-sm btn-circle right-2 top-2">✕</label>
                    <CreateChatForm/>
                </div>
            </div>
            <input type="checkbox" id="edit-chat" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <label htmlFor="edit-chat" className="absolute btn btn-sm btn-circle right-2 top-2">✕</label>
                    <EditChatForm/>
                </div>
            </div>
            <input type="checkbox" id="members" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <label htmlFor="members" className="absolute btn btn-sm btn-circle right-2 top-2">✕</label>
                    <Members/>
                </div>
            </div>
        </>
    )
}

export default withAuth(AuthOption.ANY, Chat)