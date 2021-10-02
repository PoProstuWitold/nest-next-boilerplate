import React from 'react'
import Link from 'next/link'

interface SideBarProps {
    isOpen: boolean
}

export const SideBar: React.FC<SideBarProps> = ({ isOpen }) => {
    return (
        isOpen ? 
        <div className="absolute w-full min-w-full menu">
            <div className="z-50 bg-gray-800">
            <div className="flex flex-col flex-1">
                <a className="m-1 btn btn-ghost btn-sm">
                    Home
                </a> 
                <Link href="/me">
                <a className="m-1 btn btn-ghost btn-sm">
                    Me
                </a>
                </Link>
                <a className="m-1 btn btn-ghost btn-sm">
                    Contact
                </a>
                </div>
            </div>
        </div>
        :
        null
    )
}