import Head from 'next/head'
import { useSelector } from 'react-redux'
import { Container } from '../components/Container'
import { RootState } from '../store/store'
import { AuthOption, withAuth } from '../utils/withAuth'

interface MeProps {

}

const Me: React.FC<MeProps> = ({}) => {
    let userState = useSelector((state: RootState) => state.user)
    const { user, authenticated } = userState
    
    return (
        <>
            <Head>
                <title>Profile</title>
                <meta name="description" content="Profile page" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container>
            <div className="h-fit">
                    {
                        authenticated && user !== null ?
                        <div>
                            <p>id: {user.id}</p>
                            <p>createdAt: {user.createdAt}</p>
                            <p>updatedAt: {user.updatedAt}</p>
                            <p>provider: {user.provider}</p>
                            <p>providerId: {user.providerId}</p>
                            <p>email: {user.email}</p>
                            <p>firstName: {user.firstName}</p>
                            <p>lastName: {user.lastName}</p>
                            <p>displayName: {user.displayName}</p>
                        </div> 
                        : 'NOT LOGGED'
                    }
                </div>
            </Container>
        </>
    )
}

export default withAuth(AuthOption.REQUIRED, Me)