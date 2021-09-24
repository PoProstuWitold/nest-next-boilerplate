interface SocialLoginProps {
    provider: string
    url: string
}

export const SocialLogin: React.FC<SocialLoginProps> = ({ provider, url }) => {

    return (
        <form action={url}>
            <i className="mr-2 fa fa-google"/>
            <button type="submit" className="google-button">
                <span>Continue with {provider}</span>
            </button>
        </form>
    )
}