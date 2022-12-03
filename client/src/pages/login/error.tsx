import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react'

import { Container } from '../../components/Container';
import { AuthOption, withAuth } from '../../utils/withAuth';


interface LoginErrorProps {

}

const LoginError: React.FC<LoginErrorProps> = ({}) => {

    const router = useRouter()
    const { message } = router.query

    return (
        <>
            <Head>
                <title>Login Error</title>
                <meta name="description" content="Welcome to Witq" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container>
                <div>
                    <h1 className="text-xl">Login Error</h1>
                    <p>{message || `Either account is not verified or social provider's email is already in use in`}</p>
                </div>
            </Container>
        </>
    );
}

export default withAuth(AuthOption.FORBIDDEN, LoginError)