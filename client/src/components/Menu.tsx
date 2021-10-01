import React from 'react'

interface MenuProps {

}

const Menu: React.FC<MenuProps> = ({}) => {
    return (
        <div className="py-4 artboard artboard-demo bg-base-200">
        <ul className="py-3 shadow-lg menu bg-base-100 rounded-box">
            <li className="menu-title">
            <span>
                    Menu Title
                </span>
            </li> 
            <li>
            <a>
                    Item without icon
                </a>
            </li> 
            <li>
            <a>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 mr-2 stroke-current">        
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path> 
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>                 
                </svg>
                    Item with icon
                
            </a>
            </li> 
            <li>
            <a>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 mr-2 stroke-current">          
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>                
                </svg>
                    Item with icon
                    
                <div className="ml-2 badge success">3</div>
            </a>
            </li>
        </ul>
        </div>

    );
}

export default Menu