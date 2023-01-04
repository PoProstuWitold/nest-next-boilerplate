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
import { CreateConversationForm } from '../../components/chat/CreateConversationForm'


interface ChatProps {

}


const Chat: React.FC<ChatProps> = ({}) => {

    const dispatch = useDispatch<Dispatch>()

    let userState = useSelector((state: RootState) => state.user)
    const { user } = userState

    let roomState = useSelector((state: RootState) => state.room)
    const { rooms, activeRoom } = roomState

    let conversationState = useSelector((state: RootState) => state.conversation)
    const { conversations, activeConversation } = conversationState

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
        })
        socket.emit('conversation:all')
        socket.on('conversation:all', async (conversations) => {
            await dispatch.conversation.setConversations()
            if(!conversations.length) {
                setMessages('')
                dispatch.conversation.setActiveConversation(null)
            }
        })
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if(socket) {
            socket.on('connect', () => {
                console.log('Socket connected')
            })
          
            socket.on('disconnect', async () => {
                try {
                    console.log('Socket disconnected')
                    await dispatch.user.reconnect()
                } catch (err) {
                    console.log('Reconnection failed')
                }
            })

            socket.on('message:created', async (message) => {
                console.log('message:created', message)
                if(activeRoom && message.room && message.room.id === activeRoom.id) {
                    setMessages((messages: any[]) => [...messages, message])
                }
                if(activeConversation && message.conversation && message.conversation.id === activeConversation.id) {
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
                console.log('room:all', rooms)
            })
          
            socket.on('room:messages', async (messages) => {
                console.log('room:messages', messages)
                setMessages(messages)
            })

            socket.on('conversation:all', async (conversations) => {
                await dispatch.conversation.setConversations()

                if(activeConversation) {
                    const updated = await conversations.find((conversation: any) => conversation.id === activeConversation.id)
                    await dispatch.conversation.setActiveConversation(updated)
                }
                
                if(!conversations.length) {
                    setMessages('')
                    dispatch.conversation.setActiveConversation(null)
                }
                console.log('conversation:all', conversations)
            })
          
            socket.on('conversation:messages', async (messages) => {
                console.log('conversation:messages', messages)
                setMessages(messages)
            })

            return () => {
                socket.off('connect')
                socket.off('disconnect')
                socket.off('message:created')
                socket.off('room:all')
                socket.off('room:messages')
                socket.off('conversation:all')
                socket.off('conversation:messages')
            }
        }
    }, [socket, rooms, conversations, activeConversation, activeRoom, user])

    if(!user) {
        return (
            <></>
        )
    }

    const setActiveRoomAndGetMessages = async (room: any ) => {
        dispatch.conversation.setActiveConversation(null)
        setMessages([])
        socket.emit('room:leave')
        dispatch.room.setActiveRoom(room)
        socket.emit('room:join', ({ roomId: room.id }))
    }

    const setActiveConversationAndGetMessages = async (conversation: any ) => {
        dispatch.room.setActiveRoom(null)
        setMessages('')
        dispatch.conversation.setActiveConversation(conversation)
        socket.emit('conversation:join', ({ conversationId: conversation.id }))
    }

    const getConversationName = (chat: any) => {
        
        if(chat.recipient.displayName === user.displayName && chat.creator.displayName === user.displayName) {
            return `${chat.creator.displayName} (you)`
        }
        if(chat.creator.displayName === user.displayName) {
            return chat.recipient.displayName
        }
        if(chat.recipient.displayName === user.displayName) {
            return chat.creator.displayName
        }
    }

    return (
        <>
            <Head>
                <title>Your chats</title>
                <meta name="description" content="Welcome to Witq"/>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* <div className="mx-10 mt-10"> */}
                <div className="bg-base-200">
                    <div className="flex flex-col lg:flex-row">
                        <div className="p-5 lg:w-1/3">
                            <div className="bg-base-200 rounded-xl">
                                <div className="inline-flex">
                                    <h2 className="m-2 text-2xl">Chats</h2>
                                    <label htmlFor="create-chat" className="m-2 btn btn-sm">add</label>
                                </div>
                                <ul className="overflow-auto min-h-[11rem] max-h-[11rem]">
                                    {/* ROOMS */}
                                    <li>
                                        {rooms && rooms.map((room: any, index: number) =>
                                            <div key={index} onClick={() => setActiveRoomAndGetMessages(room)} className={room === activeRoom ? "bg-base-300" : ""}>
                                                <ChatButton chat={room} type='room'/>
                                            </div>
                                        )}
                                    </li>
                                </ul>
                                <div className="inline-flex">
                                    <h2 className="m-2 text-2xl">Converastions</h2>
                                    <label htmlFor="create-conversation" className="m-2 btn btn-sm">add</label>
                                </div>
                                <ul className="overflow-auto min-h-[11rem] max-h-[11rem]">
                                    {/* CONVERSATIONS */}
                                    <li>
                                        {conversations && conversations.map((conversation: any, index: number) =>
                                            <div key={index} onClick={() => setActiveConversationAndGetMessages(conversation)} className={conversation === activeConversation ? "bg-base-300" : ""}>
                                                <ChatButton chat={conversation} type='conversation'/>
                                            </div>
                                        )}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-4 lg:w-2/3 border-base-300">
                            <div className="rounded-xl">
                                <div className="w-full">
                                    {rooms && activeRoom &&
                                        <>
                                            <div className="relative flex items-center p-3 border-b-4 border-base-300">
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
                                            <div className="relative w-full p-6 overflow-y-auto h-[20rem]">
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

                                            <MessageInput chatId={activeRoom.id} type='room'/>
                                        </>
                                    }
                                    {conversations && activeConversation &&
                                        <>
                                            <div className="relative flex items-center p-3 border-b-4 border-base-300">
                                                <img className="object-cover w-10 h-10 rounded-full" src="http://simpleicon.com/wp-content/uploads/multy-user.png" alt="username" />
                                                <span className="block ml-2 font-bold">{getConversationName(activeConversation)}</span>
                                            </div>  
                                            <div className="relative w-full p-6 overflow-y-auto h-[20rem]">
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

                                            <MessageInput chatId={activeConversation.id} type='conversation'/>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/* </div>   */}
            <input type="checkbox" id="create-chat" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <label htmlFor="create-chat" className="absolute btn btn-sm btn-circle right-2 top-2">✕</label>
                    <CreateChatForm/>
                </div>
            </div>
            <input type="checkbox" id="create-conversation" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <label htmlFor="create-conversation" className="absolute btn btn-sm btn-circle right-2 top-2">✕</label>
                    <CreateConversationForm/>
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
                <div className="min-w-content modal-box">
                    <label htmlFor="members" className="absolute btn btn-sm btn-circle right-2 top-2">✕</label>
                    <Members/>
                </div>
            </div>
        </>
    )
}

export default withAuth(AuthOption.ANY, Chat)