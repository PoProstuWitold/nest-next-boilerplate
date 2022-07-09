import Head from 'next/head'
import { useSelector } from 'react-redux'
import { FiSettings } from 'react-icons/fi'
import { useEffect, useRef, useState } from 'react'

import { ChatButton } from '../../components/chat/ChatButton'
import { Message } from '../../components/chat/Message'
import { MessageInput } from '../../components/chat/MessageInput'
import { RootState } from '../../store/store'
import { AuthOption, withAuth } from '../../utils/withAuth'
import { useAuthenticatedSocket } from '../../utils/useSocket'
import { CreateChatForm } from '../../components/chat/CreateChatForm'

interface ChatProps {

}


const Chat: React.FC<ChatProps> = ({}) => {

    const messagesEndRef = useRef<null | HTMLDivElement>(null)
    const { socket } = useAuthenticatedSocket('ws://localhost:4000/chat')

    const [rooms, setRooms] = useState<any>('')
    const [activeRoom, setActiveRoom] = useState<any>(false)
    const [messages, setMessages] = useState<any>('')

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    
    console.log(socket)
    let userState = useSelector((state: RootState) => state.user)
    const { user } = userState
    
    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if(socket) {
            socket.on('connect', () => {
                console.log('Socket connected', socket)
            })
          
            socket.on('disconnect', () => {
                console.log('Socket disconnected')
            })

            socket.on('message:created', async (message) => {
                if(message.room.id === activeRoom.id) {
                    setMessages((messages: any[]) => [...messages, message])
                }
            })
          
            socket.on('room:all', async (rooms) => {
                setRooms(rooms)
                console.log('rooms', rooms)
            })
          
            socket.on('room:messages', async (messages) => {
                console.log('messages', messages)
                setMessages(messages)
            })
          
          
            socket.on('pong', () => {
                console.log('YAYAYAYAYA!')
            })

            return () => {
                socket.off('connect')
                socket.off('disconnect')
                socket.off('pong')
                socket.off('message:created')
                socket.off('room:all')
                socket.off('room:messages')
            }
        }
    }, [socket, rooms, activeRoom])

    if(!user) {
        return (
            <></>
        )
    }

    const isUserModOrOwner = (room: any) => {
        let modOrOwner: boolean
        modOrOwner = room.owner === user.id
        for(const mod of room.mods) {
            if(mod.id === user.id) {
                return modOrOwner = true
            }
        }

        return modOrOwner
    }

    const setActiveRoomAndGetMessages = async (room: any ) => {
        socket.emit('room:leave')
        setActiveRoom(room)
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
                                <ul className="overflow-auto h-[32rem]">
                                    <div className="inline-flex">
                                        <h2 className="m-2 text-2xl">Chats</h2>
                                        <label htmlFor="create-chat" className="m-2 btn btn-sm">add</label>
                                    </div>
                                    <li>
                                        {rooms && rooms.map((room: any, index: number) =>
                                            <div key={index} onClick={() => setActiveRoomAndGetMessages(room)} className={room === activeRoom ? "bg-base-300" : ""}>
                                                <ChatButton name={room.name} description={room.description} />
                                            </div>
                                        )}
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
                                                {activeRoom.users && isUserModOrOwner(activeRoom) &&
                                                    <button type="submit" className={`ml-2 btn btn-sm btn-ghost font-semibold}`}>
                                                        <FiSettings/> <p className="ml-2">Edit</p>
                                                    </button>
                                                }
                                            </div>
                                            <div className="relative w-full p-6 overflow-y-auto h-[40rem]">
                                                <ul className="space-y-2">
                                                    {/* <Message text="hi" author={user}/>
                                                    <Message text="Hiiii" author={user}/>
                                                    <Message text="how are you?" author={user}/>
                                                    <Message text="Lorem ipsum dolor sit, amet consectetur adipisicing elit." author={user}/> */}
                                                    {messages && messages.map((message: any, index: number) =>
                                                        <div key={index}>
                                                            <Message text={message.text} author={message.author}/>
                                                        </div>
                                                        
                                                        )
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
        </>
    )
}

export default withAuth(AuthOption.ANY, Chat)