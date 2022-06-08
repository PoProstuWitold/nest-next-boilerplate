import { BsGoogle, BsFacebook } from 'react-icons/bs'

interface SocialLoginProps {
    provider: 'Google' | 'Facebook'
    url: string
    className?: string
}

export const SocialLogin: React.FC<SocialLoginProps> = ({ provider, url, className }) => {
    return (
        <a href={url} className={`${className} mb-4 flex-1 w-full font-bold text-white border-0 btn focus:outline-none focus:shadow-outline 
                       ${provider === 'Facebook' ? 'bg-blue-800 hover:bg-blue-900 ' : ''}
                        ${provider === 'Google' ? 'bg-red-700 hover:bg-red-800 ' : ''}
       `}>
        {provider === 'Google' ? <BsGoogle/> : null}
        {provider === 'Facebook' ? <BsFacebook/> : null}
        <p className="ml-2">{provider}</p>
        </a>
    )
}