import React from 'react'
import { AiFillUnlock, AiFillLock } from 'react-icons/ai'
interface ChatButtonProps {
    room: any
}

export const ChatButton: React.FC<ChatButtonProps> = ({ room }) => {
    return (
        <a className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b cursor-pointer border-base-200 hover:bg-base-100 focus:outline-none">
            <img className="object-cover w-10 h-10 rounded-full" src="http://simpleicon.com/wp-content/uploads/multy-user.png" alt="username" />
            <div className="w-full pb-2">
                <div className="flex justify-between">
                    <span className="block ml-2 font-semibold">{room.name}</span>
                    {room.isPublic ? <AiFillUnlock className="text-2xl"/> : <AiFillLock className="text-2xl"/> }
                </div>
                <span className="block ml-2 text-sm">{room.description}</span>
            </div>
        </a>
    )
}