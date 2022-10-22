import React from 'react'
import { AiFillUnlock, AiFillLock } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

interface ChatButtonProps {
    chat: any
    type: 'room' | 'conversation'
}

export const ChatButton: React.FC<ChatButtonProps> = ({ chat, type }) => {

    let userState = useSelector((state: RootState) => state.user)
    const { user } = userState

    if(!user) {
        return <></>
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
        <a className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b cursor-pointer border-base-200 hover:bg-base-100 focus:outline-none">
            <img className="object-cover w-10 h-10 rounded-full" src="http://simpleicon.com/wp-content/uploads/multy-user.png" alt="username" />
            <div className="w-full pb-2">
                {type && type === 'room' &&
                    <>
                        <div className="flex justify-between">
                        <span className="block ml-2 font-semibold">{chat.name}</span>
                            {chat.isPublic ? <AiFillUnlock className="text-2xl"/> : <AiFillLock className="text-2xl"/> }
                        </div>
                        <span className="block ml-2 text-sm">{chat.description}</span>
                    </>
                }
                {type && type === 'conversation' &&
                    <>
                        <div className="flex justify-between">
                        <span className="block ml-2 font-semibold">{getConversationName(chat)}</span>
                        </div>
                    </>
                }
            </div>
        </a>
    )
}