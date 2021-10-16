import React from 'react'
import Link from 'next/link'

interface SideBarProps {
    isOpen: boolean
}

export const SideBar: React.FC<SideBarProps> = ({ isOpen }) => {
    return (
        isOpen ? 
        <div className="absolute w-full min-w-full menu lg:hidden">
            <div className="z-50 bg-base-200">
            <div className="flex flex-col flex-1">
                <Link href="/me">
                <a className="m-1 btn btn-ghost">
                    Me
                </a>
                </Link>
                <Link href="/signup">
                <a className="m-1 btn btn-ghost">
                    Sign up
                </a>
                </Link>
                <Link href="/signin">
                <a className="m-1 btn btn-ghost">
                    Sign in
                </a>
                </Link>
                </div>
            </div>
        </div>
        :
        null
    )
}