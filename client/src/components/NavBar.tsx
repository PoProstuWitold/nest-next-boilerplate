import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { AiOutlineMenu } from 'react-icons/ai'

import { authRoutes, Themes } from '../utils/constants'
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
            <div className="sticky top-0 z-50">
                <div className="h-5 shadow-lg navbar bg-primary">
                    <div className="flex-none px-2 mx-2">
                        <Link href="/">
                                <a className="text-lg font-bold">
                                PoProstuWitold
                                </a>
                        </Link>
                    </div> 
                    <div className="flex-1 px-2 mx-2">
                        {/* {
                            user && authenticated ?
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
                                <Link href="/login">
                                    <a className="btn btn-ghost btn-sm rounded-btn">
                                        Sign in/Sign up
                                    </a>
                                </Link>
                            </div>
                        } */}
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
                        <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="text-2xl btn btn-ghost"><AiOutlineMenu/></label>
                        <ul tabIndex={0} className="p-2 shadow dropdown-content menu bg-base-100 rounded-box w-52">
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
                    </div>
                </div>
            </div>
        </>
    
    )
}