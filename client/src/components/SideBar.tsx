import React from 'react'
import Link from 'next/link'

interface SideBarProps {
    isOpen: boolean
    user: any
    logout(): Promise<void>
}

export const SideBar: React.FC<SideBarProps> = ({ isOpen, user, logout }) => {
    return (
        isOpen ? 
        <div className="absolute w-full min-w-full menu lg:hidden">
            <div className="z-50 bg-base-200">
            {
                user ? 
                <div className="flex flex-col flex-1">
                <Link href="/me">
                <a className="m-1 btn btn-ghost">
                    Me
                </a>
                </Link>
                <button
                    className="m-1 btn btn-ghost rounded-btn"
                    onClick={logout}
                >
                    Logout
                </button>
                </div> :
                <div className="flex flex-col flex-1">
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
            }
            </div>
        </div>
        :
        null
    )
}