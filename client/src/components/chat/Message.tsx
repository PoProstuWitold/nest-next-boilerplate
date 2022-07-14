import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { User } from '../../utils/types'

interface MessageProps {
    msg: any
    author: User
    nextMsg: any
}

export const Message: React.FC<MessageProps> = ({ msg, author, nextMsg }) => {

    let userState = useSelector((state: RootState) => state.user)
    const { user } = userState

    if(!user) {
        return <></>
    }

    const hour = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const date = new Date(msg.createdAt).toLocaleDateString().replace(/\//g, '.')

    return (
        <li>
            <div className={`flex ${author.id === user.id ? "justify-end" : "justify-start"}`}>
                {nextMsg &&
                    <span className="text-xs">{author.displayName === nextMsg.author.displayName ? '' : `${author.displayName}`}</span>
                }
                {!nextMsg &&
                    <span className="text-xs">{`${author.displayName}`}</span>
                }
            </div>
            <div className={`flex ${author.id === user.id ? "justify-end" : "justify-start"}`}>
                <div className="relative">
                    <div className={`tooltip ${author.id === user.id ? "tooltip-left" : "tooltip-right"}`} data-tip={`${hour} ${date}`}>
                        <div className={`relative hover:cursor-pointer max-w-xl px-4 py-2 rounded shadow ${author.id === user.id ? "bg-secondary" : "bg-accent"}`}>
                            <span className="block">{msg.text}</span>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    )
}