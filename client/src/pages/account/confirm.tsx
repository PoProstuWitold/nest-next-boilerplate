import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Container } from '../../components/Container'
import { RootState } from '../../store/store'
import { AuthOption, withAuth } from '../../utils/withAuth'

interface ConfirmProps {

}

const Confirm: React.FC<ConfirmProps> = ({}) => {
    let userState = useSelector((state: RootState) => state.user)
    const [ApiResponse, setApiResponse] = useState<any>('')
    const { user, authenticated } = userState
    
    const router = useRouter()
    const { token } = router.query

    const confirmAccount = async () => {
        console.log('gowno')
        const res = await axios.get('/auth/account/confirm', {
            params: {
                token: token
            }
        })
        console.log(res.data)
        setApiResponse(res.data)
        console.log('gowdaads', ApiResponse)
    }

    const resendConfirmationToken = async () => {
        console.log('gowno')
        const res = await axios.get('/auth/account/confirm', {
            params: {
                token: token
            }
        })
        console.log(res.data)
        setApiResponse(res.data)
        console.log('gowdaads', ApiResponse)
    }

    return (
        <>
            <Head>
                <title>Confirm account</title>
                <meta name="description" content="Profile page" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container>
                {!ApiResponse ? <button onClick={confirmAccount} className="btn btn-primary btn-outline">Confirm account</button> 
                : 
                <div>
                    {!ApiResponse.success 
                        ? <p className="text-xl">{ApiResponse.message}. Click here to <button onClick={resendConfirmationToken} className="btn-link">resend it</button></p>
                        : <p className="text-xl">{ApiResponse.message}</p>
                    }
                    
                </div>
                }
            </Container>
        </>
    )
}

export default withAuth(AuthOption.REQUIRED, Confirm)