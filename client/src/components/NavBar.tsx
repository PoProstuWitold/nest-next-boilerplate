import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { SideBar } from './SideBar'

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = () => {
    const node = useRef<any>()
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const handleClickOutside = (e: any) => {
        console.log("clicking anywhere")
        if (!node.current) {
            return
        }
        if (node.current && node.current.contains(e.target)) {
            return
        }
        // outside click
        setIsOpen(false)
    }

    const toggleMenu = async () => {
        setIsOpen(!isOpen)
        console.log(isOpen)
    }

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        } else {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen])

    return (
        <div ref={node}>
        <div className="h-5 shadow-lg navbar bg-neutral text-neutral-content">
            <div className="flex-none px-2 mx-2">
                <Link href="/">
                        <a className="text-lg font-bold">
                        PoProstuWitold
                        </a>
                </Link>
            </div> 
            <div className="flex-1 px-2 mx-2">
                <div className="items-stretch hidden lg:flex">
                <Link href="/me">
                <a className="btn btn-ghost btn-sm rounded-btn">
                    Me
                </a>
                </Link>
                <Link href="/signup">
                <a className="btn btn-ghost btn-sm rounded-btn">
                    Sign up
                </a>
                </Link>
                <Link href="/signin">
                <a className="btn btn-ghost btn-sm rounded-btn">
                    Sign in
                </a>
                </Link>
                </div>
            </div> 
            <div className="flex-none">
            <button onClick={toggleMenu} className="lg:hidden btn btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">           
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>               
                </svg>
            </button>
        </div>
        </div>

    <SideBar isOpen={isOpen} />
    </div>
    )
}