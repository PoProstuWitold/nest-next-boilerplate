import Head from 'next/head'
import { FormEvent, useState } from 'react'
import { Container } from '../components/Container'
import { InputField } from '../components/InputField'
import { useRouter } from 'next/router'
import { mapErrors } from '../utils/mapErrors'
import { SocialLogin } from '../components/SocialLogin'
import { SERVER_URL } from '../utils/constants'
import { useDispatch } from 'react-redux'
import { Dispatch } from '../store/store'
import { AuthOption, withAuth } from '../utils/withAuth'

interface SignUpProps {

}

const signUp: React.FC<SignUpProps> = ({}) => {

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [displayName, setDisplayName] = useState<string>('')
    const [errors, setErrors] = useState<any>({})
    const dispatch = useDispatch<Dispatch>()

    const router = useRouter()

    const submitForm = async (event: FormEvent) => {
        event.preventDefault()
    
        try {
            const res = await dispatch.user.localRegisterAsync({ email, password, firstName, lastName, displayName})
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
        <div className="bg-base-100">
            <Head>
                <title>Sign up</title>
                <meta name="description" content="Create new account" />
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
                            type="password"
                            value={password}
                            setValue={setPassword}
                            placeholder="Enter your password"
                            error={errors.password}
                        />
                        <InputField
                            label="First name"
                            type="text"
                            value={firstName}
                            setValue={setFirstName}
                            placeholder="Enter your first name"
                            error={errors.firstName}
                        />
                        <InputField
                            label="Last name"
                            type="text"
                            value={lastName}
                            setValue={setLastName}
                            placeholder="Enter your last name"
                            error={errors.lastName}
                        />
                        <InputField
                            label="Display name"
                            className="mb-4"
                            type="text"
                            value={displayName}
                            setValue={setDisplayName}
                            placeholder="Enter your display (nick) name"
                            error={errors.displayName}
                        />
                        <button className="w-full mb-4 btn">
                            Submit
                        </button>
                    </form>
                    <SocialLogin provider="Google" url={`${SERVER_URL}/auth/google`}/>
                    <SocialLogin provider="Facebook" url={`${SERVER_URL}/auth/facebook`}/>
                </div>
            </Container>
        </div>
        </>
    )
}

export default withAuth(AuthOption.FORBIDDEN, signUp)