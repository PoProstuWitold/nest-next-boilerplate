import Head from 'next/head';
import React from 'react'
import { Container } from '../../components/Container';
import { AuthOption, withAuth } from '../../utils/withAuth';

interface LoginErrorProps {

}

const LoginError: React.FC<LoginErrorProps> = ({}) => {
    return (
        <>
            <Head>
                <title>Nest Next Boilerplate</title>
                <meta name="description" content="Welcome to Witq" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container>
                <div>
                    <h1 className="text-xl">Login Error</h1>
                    <p>Either account is not verified or social provider's email is already in use in</p>
                </div>
            </Container>
        </>
    );
}

export default withAuth(AuthOption.FORBIDDEN, LoginError)