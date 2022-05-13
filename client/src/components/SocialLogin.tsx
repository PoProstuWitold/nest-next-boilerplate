interface SocialLoginProps {
    provider: 'Google' | 'Facebook'
    url: string
}

export const SocialLogin: React.FC<SocialLoginProps> = ({ provider, url }) => {
    return (
        <a href={url} className={`mb-4 p-3 font-bold text-white border-0 w-full btn focus:outline-none focus:shadow-outline 
                       ${provider === 'Facebook' ? 'bg-blue-800 hover:bg-blue-900 ' : ''}
                        ${provider === 'Google' ? 'bg-red-700 hover:bg-red-800 ' : ''}
       `}>
          Continue with {provider}
        </a>
    )
}