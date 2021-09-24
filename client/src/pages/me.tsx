import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { SERVER_URL } from '../utils/constants'

interface MeProps {

}

const Me: React.FC<MeProps> = ({}) => {
    const fetchData = async (url: string) => {
        try {
            const res = await axios.get(url, {
                withCredentials: true
            })
            setUser(res.data)
            console.log(res.data)
        } catch (err) {
            console.log(err)
        }
    }
    const [user, setUser] = useState<any>({})
    useEffect(() => {
        fetchData(`${SERVER_URL}/auth/me`)
    }, [])

    return (
        <div>
            {
                user.id ? 
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