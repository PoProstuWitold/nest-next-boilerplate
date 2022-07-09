import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { User } from '../../utils/types'

interface MessageProps {
    text: string
    author: User
}

export const Message: React.FC<MessageProps> = ({ text, author }) => {

    let userState = useSelector((state: RootState) => state.user)
    const { user } = userState

    if(!user) {
        return <></>
    }

    return (
        <li className={`flex ${author.id === user.id ? "justify-end" : "justify-start"}`}>
            <div className={`relative max-w-xl px-4 py-2 rounded shadow ${author.id === user.id ? "bg-secondary" : "bg-accent"}`}>
                    <span className="block">{text}</span>
            </div>
        </li>
    )
}