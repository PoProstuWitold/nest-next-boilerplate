import Head from 'next/head'
import { useSelector } from 'react-redux'

import { ChatButton } from '../../components/chat/ChatButton'
import { Message } from '../../components/chat/Message'
import { MessageInput } from '../../components/chat/MessageInput'
import { Container } from '../../components/Container'
import { RootState } from '../../store/store'
import { AuthOption, withAuth } from '../../utils/withAuth'
import { useAuthenticatedSocket } from '../../utils/useSocket'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'

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
                console.log('message', message)
                setMessages((messages: any[]) => [...messages, message])
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
    }, [socket, rooms])

    if(!user) {
        return (
            <></>
        )
    }

    const setActiveRoomAndGetMessages = async (room: any ) => {
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
                                    <h2 className="my-2 mb-2 ml-2 text-lg">Chats</h2>
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
                                                <img className="object-cover w-10 h-10 rounded-full" src="https://cdn.pixabay.com/photo/2018/01/15/07/51/woman-3083383__340.jpg" alt="username" />
                                                <span className="block ml-2 font-bold">{activeRoom.name}</span>
                                                <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3">
                                                </span>
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
        </>
    )
}

export default withAuth(AuthOption.ANY, Chat)