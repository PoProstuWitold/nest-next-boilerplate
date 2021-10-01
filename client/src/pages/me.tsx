import React from 'react'
import { useAuthState } from '../context/auth'

interface MeProps {

}

const Me: React.FC<MeProps> = ({}) => {
    const { authenticated, loading, user, provider } = useAuthState()
    console.log('authenticated', authenticated)
    console.log('loading', loading)
    console.log('user', user)
    console.log('provider', provider)
    return (
        <div>
            {
                !loading && authenticated && user ?
                <div style={{ padding: '2rem' }}>
                    <p style={{ padding: '0.5rem' }}>id: {user.id}</p>
                    <p style={{ padding: '0.5rem' }}>createdAt: {user.createdAt}</p>
                    <p style={{ padding: '0.5rem' }}>updatedAt: {user.updatedAt}</p>
                    <p style={{ padding: '0.5rem' }}>provider: {user.provider}</p>
                    <p style={{ padding: '0.5rem' }}>providerId: {user.providerId}</p>
                    <p style={{ padding: '0.5rem' }}>email: {user.email}</p>
                    <p style={{ padding: '0.5rem' }}>firstName: {user.firstName}</p>
                    <p style={{ padding: '0.5rem' }}>lastName: {user.lastName}</p>
                    <p style={{ padding: '0.5rem' }}>displayName: {user.displayName}</p>
                </div> 
                : 'NOT LOGGED'
            }
        </div>
    )
}

export default Me