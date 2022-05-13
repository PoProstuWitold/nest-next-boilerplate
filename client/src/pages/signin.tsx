import Head from 'next/head'
import { FormEvent, useState } from 'react'
import { Container } from '../components/Container'
import { InputField } from '../components/InputField'
import { useRouter } from 'next/router'
import { SocialLogin } from '../components/SocialLogin'
import { SERVER_URL } from '../utils/constants'
import { useDispatch } from 'react-redux'
import { Dispatch } from '../store/store'
import { mapErrors } from '../utils/mapErrors'
import { AuthOption, withAuth } from '../utils/withAuth'


interface SignInProps {

}

const signIn: React.FC<SignInProps> = ({}) => {

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [errors, setErrors] = useState<any>({})
    const dispatch = useDispatch<Dispatch>()

    const router = useRouter()

    const submitForm = async (event: FormEvent) => {
        event.preventDefault()
    
        try {
            const res = await dispatch.user.localLoginAsync({ email, password})
            if(res.errors) {
                setErrors(mapErrors(res.errors))
            }

            if(res.user) {
                router.push('/me')
            }
        } catch (err: any) {
            console.log('ERROR', err)
        }
    }

    return (
        <>
            <Head>
                <title>Sign in</title>
                <meta name="description" content="Sign in to your account" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container>
                <div className="mx-auto w-96">
                    <form onSubmit={submitForm}>
                        <InputField
                            label="Email"
                            type="email"
                            value={email}
                            setValue={setEmail}
                            placeholder="Enter your email"
                            error={errors.email}
                        />
                        <InputField
                            label="Pasword"
                            className="mb-4"
                            type="password"
                            value={password}
                            setValue={setPassword}
                            placeholder="Enter your password"
                            error={errors.password}
                        />
                        <button className="w-full mb-4 btn">
                            Submit
                        </button>
                    </form>
                    <SocialLogin provider="Google" url={`${SERVER_URL}/auth/google`}/>
                    <SocialLogin provider="Facebook" url={`${SERVER_URL}/auth/facebook`}/>
                </div>
            </Container>
        </>
            
    )
}

export default withAuth(AuthOption.FORBIDDEN, signIn)