import React, { useRef } from 'react'
import Link from 'next/link'
import { useAuthDispatch, useAuthState } from '../context/auth'
import axios from 'axios'
import Router from 'next/router'
import { useTheme } from 'next-themes'
import { Themes } from '../utils/constants'
interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = () => {
    const { user } = useAuthState()
    const node = useRef<any>()
    const dispatch = useAuthDispatch()
    const { theme, setTheme } = useTheme()
    

    const logout = async () => {
        try {
            await axios.delete('/auth/logout')
            await dispatch('LOGOUT')
        } catch (err) {
            console.log(err)
        }     
    }

    return (
        <div className="sticky top-0 z-50" ref={node}>
        <div className="h-5 shadow-lg navbar bg-primary">
            <div className="flex-none px-2 mx-2">
                <Link href="/">
                        <a className="text-lg font-bold">
                        PoProstuWitold
                        </a>
                </Link>
            </div> 
            <div className="flex-1 px-2 mx-2">
                {
                    user ?
                    <div className="items-stretch hidden lg:flex">
                        <Link href="/me">
                        <a className="btn btn-ghost btn-sm rounded-btn">
                            Me
                        </a>
                        </Link>
                        <button
                            className="btn btn-ghost btn-sm rounded-btn"
                            onClick={logout}
                        >
                        Logout
                        </button>
                    </div>
                    :
                    <div className="items-stretch hidden lg:flex">
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
                }
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal">
                    <li tabIndex={0}>
                        <a>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
                            <p>Theme</p>
                        <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                        </a>
                        <ul className="z-50 w-full p-2 border border-t-0 bg-base-100">
                            {
                                Themes.map((theme, index) => (
                                    <li key={index} onClick={() => setTheme(theme.name.toLowerCase())}><a>{theme.name}</a></li>
                                ))
                            }
                        </ul>
                    </li>
                </ul>
            </div>
            <div className="flex-none">
            <label htmlFor="my-drawer-2" className="btn btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">           
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>               
                </svg>
            </label>
            <div>
            
            
            </div>
        </div>
        </div>
        
            
    </div>
    )
}