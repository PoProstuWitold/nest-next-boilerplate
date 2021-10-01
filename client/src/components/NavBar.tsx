import React from 'react'

interface NavBarProps {

}

const NavBar: React.FC<NavBarProps> = ({}) => {
    return (
        <div className="mb-2 shadow-lg navbar bg-neutral text-neutral-content">
            <div className="flex-none px-2 mx-2">
                <span className="text-lg font-bold">
                        daisyUI
                    </span>
            </div> 
            <div className="flex-1 px-2 mx-2">
                <div className="items-stretch hidden lg:flex">
                <a className="btn btn-ghost btn-sm rounded-btn">
                    Home
                </a> 
                <a className="btn btn-ghost btn-sm rounded-btn">
                    Me
                </a>
                <a className="btn btn-ghost btn-sm rounded-btn">
                    Contact
                </a>
                </div>
            </div> 
            <div className="flex-none">
            <button className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">           
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>               
            </svg>
            </button>
        </div>
        </div>
    )
}

export default NavBar