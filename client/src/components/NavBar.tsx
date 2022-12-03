import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { AiOutlineMenu } from 'react-icons/ai'

import { authRoutes, themes } from '../utils/constants'
import { Dispatch, RootState } from '../store/store'
import { useAuthenticatedSocket } from '../utils/useSocket'


interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = () => {
    useAuthenticatedSocket('ws://localhost:4000/chat')
    const { theme, setTheme } = useTheme()
    const router = useRouter()
    const dispatch = useDispatch<Dispatch>()
    const { user, authenticated } = useSelector((state: RootState) => state.user)
    
    const thisRoute = authRoutes.includes(router.pathname)

    const logout = async () => {
        try {
            if(thisRoute) {
                router.back()
            }
            dispatch.user.logoutAsync()
        } catch (err) {
            console.log(err)
        }     
    }
    return (
        <>
            <nav className="sticky top-0 z-50 shadow-2xl bg-base-300 navbar">
                <div className="navbar-start">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </label>
                        <ul tabIndex={0} className="p-2 mt-3 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                        {
                            user && authenticated ?
                            <>
                                <li>
                                    <Link href="/me">
                                        <a className="btn btn-ghost btn-sm rounded-btn">
                                            Me
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        className="btn btn-ghost btn-sm rounded-btn"
                                        onClick={logout}
                                    >
                                        Logout
                                    </button>
                                </li>
                                <li>
                                    <Link href="/chat">
                                        <a className="btn btn-ghost btn-sm rounded-btn">
                                            Chats
                                        </a>
                                    </Link>
                                </li>
                            </>
                            :
                            <div className="items-stretch hidden lg:flex">
                                <Link href="/login">
                                    <a className="btn btn-ghost btn-sm rounded-btn">
                                        Sign in/Sign up
                                    </a>
                                </Link>
                            </div>
                        }
                        </ul>
                    </div>
                    <div className="flex-none px-2 mx-2">
                        <Link href="/">
                                <a className="text-lg font-bold">
                                PoProstuWitold
                                </a>
                        </Link>
                    </div>
                    <div className="hidden lg:flex-none lg:flex">
                        <ul className="p-0 menu menu-horizontal">
                            {user && authenticated ?
                                <>
                                    <li>
                                        <Link href="/me">
                                            <a>
                                                Me
                                            </a>
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={logout}
                                        >
                                            Logout
                                        </button>
                                    </li>
                                    <li>
                                        <Link href="/chat">
                                            <a>
                                                Chats
                                            </a>
                                        </Link>
                                    </li>
                                </>
                                :
                                <>
                                    <li>
                                        <Link href="/login">
                                            <a>
                                                Sign in/Sign up
                                            </a>
                                        </Link>
                                    </li>
                                </>

                            }
                        </ul>
                    </div>
                </div>
                <div className="navbar-end">
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
                                        themes.map((theme, index) => (
                                            <li key={index} onClick={() => setTheme(theme.name.toLowerCase())}><a>{theme.name}</a></li>
                                        ))
                                    }
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}