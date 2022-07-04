import React from 'react'
import { User } from '../../utils/types'

interface MessageProps {
    text: string
    author: User
}

export const Message: React.FC<MessageProps> = ({ text }) => {
    return (
        <li className="flex justify-start">
            <div className="relative max-w-xl px-4 py-2 rounded shadow bg-accent">
                    <span className="block">{text}</span>
            </div>
        </li>
    )
}