import Head from 'next/head'
import { useSelector } from 'react-redux'

import { ChatButton } from '../../components/chat/ChatButton'
import { Message } from '../../components/chat/Message'
import { MessageInput } from '../../components/chat/MessageInput'
import { Container } from '../../components/Container'
import { RootState } from '../../store/store'
import { AuthOption, withAuth } from '../../utils/withAuth'
import { useAuthenticatedSocket } from '../../utils/useSocket'
import { useEffect, useState } from 'react'
import axios from 'axios'

interface ChatProps {

}


const Chat: React.FC<ChatProps> = ({}) => {

    const { socket } = useAuthenticatedSocket('ws://localhost:4000/chat')
    const [isConnected, setIsConnected] = useState(false)
    const [lastPong, setLastPong] = useState('')
    console.log(socket)
    let userState = useSelector((state: RootState) => state.user)
    const { user } = userState
    
    useEffect(() => {
        if(socket) {
            setIsConnected(socket.connected)
            socket.on('connect', () => {
                console.log(socket)
                setIsConnected(true)
            })
          
            socket.on('disconnect', () => {
                setIsConnected(false)
            })
          
            socket.on('pong', () => {
                console.log('YAYAYAYAYA!')
                setLastPong(new Date().toISOString())
            })

            return () => {
                socket.off('connect')
                socket.off('disconnect')
                socket.off('pong')
            }
        }
    }, [socket])

    const sendPing = async () => {
        await axios.get('/auth/me')
    }

    if(!user) {
        return (
            <div className="min-h-screen mx-10 mt-10">
                <p>Connected: { '' + isConnected }</p>
                <p>Last pong: { lastPong || '-' }</p>
                <button onClick={ sendPing }>Send ping</button>
            </div>
        )
    }


    return (
        <>
            <Head>
                <title>Your chats</title>
                <meta name="description" content="Welcome to Witq"/>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="min-h-screen mx-10 mt-10">
                <div>
                    <p>Connected: { '' + isConnected }</p>
                    <p>Last pong: { lastPong || '-' }</p>
                    <button onClick={ sendPing }>Send ping</button>
                </div>
                <div className="shadow-2xl bg-base-200 rounded-xl">
                    <div className="flex flex-col lg:flex-row">
                        <div className="p-5 lg:w-1/3">
                            <div className="shadow-2xl bg-base-200 rounded-xl">
                                <ul className="overflow-auto h-[32rem]">
                                    <h2 className="my-2 mb-2 ml-2 text-lg">Chats</h2>
                                    <li>
                                    <ChatButton name="Jhon Don" lastMessage="bye"/>
                                    <ChatButton name="Same" lastMessage="Good night"/>
                                    <ChatButton name="Emma" lastMessage="Good Morning"/>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="p-5 lg:w-2/3">
                            <div className="shadow-2xl rounded-xl">
                                <div className="w-full">
                                    <div className="relative flex items-center p-3 border-b border-primary-focus">
                                        <img className="object-cover w-10 h-10 rounded-full" src="https://cdn.pixabay.com/photo/2018/01/15/07/51/woman-3083383__340.jpg" alt="username" />
                                        <span className="block ml-2 font-bold">Emma</span>
                                        <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3">
                                        </span>
                                    </div>
                                    <div className="relative w-full p-6 overflow-y-auto h-[40rem]">
                                        <ul className="space-y-2">
                                            <Message text="hi" author={user}/>
                                            <Message text="Hiiii" author={user}/>
                                            <Message text="how are you?" author={user}/>
                                            <Message text="Lorem ipsum dolor sit, amet consectetur adipisicing elit." author={user}/>
                                        </ul>
                                    </div>

                                    <MessageInput/>
                                    
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