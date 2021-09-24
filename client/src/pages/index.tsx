import Head from 'next/head'
import { SocialLogin } from '../components/social-login'
import { SERVER_URL } from '../utils/constants'

interface indexProps {

}

const Index: React.FC<indexProps> = ({}) => {
    return (
        <div>
            <Head>
            <title>Nest Next Boilerplate</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                <br />
                <SocialLogin provider="Google" url={`${SERVER_URL}/auth/google`}/>
                <br />
                <SocialLogin provider="Facebook" url={`${SERVER_URL}/auth/facebook`}/>
                <br />
            </div>
        </div>
    )
}

export default Index