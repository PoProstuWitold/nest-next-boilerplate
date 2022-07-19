import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Container } from '../components/Container'
import { RootState } from '../store/store'
import { useAuthenticatedSocket } from '../utils/useSocket'

interface InviteProps {

}

const Index: React.FC<InviteProps> = ({}) => {
    const { socket } = useAuthenticatedSocket('ws://localhost:4000/chat')
    let userState = useSelector((state: RootState) => state.user)
    const { user, authenticated } = userState
    const router = useRouter()
    const { code } = router.query

    const [ApiResponse, setApiResponse] = useState<any>(null)
    const [JoinRoomResponse, setJoinRoomResponse] = useState<any>(null)

    useEffect(() => {
        if(socket) {
            socket.on('connect', () => {
                console.log('Socket connected')
            })
          
            socket.on('disconnect', () => {
                console.log('Socket disconnected')
            })

            return () => {
                socket.off('connect')
                socket.off('disconnect')
                socket.off('error')
            }
        }
    }, [socket])

    if(!user) {
        return <></>
    }

    useEffect(() => {
        const getInvintationByCode = async() => {
            try {
                const res = await axios.get('/room/invitation', { 
                    params: {
                        code
                    }
                })
                console.log(code)
                setApiResponse(res.data)
                console.log(res.data)
            } catch (err) {
                setApiResponse(err)
            }
        }
        if(code) {
            getInvintationByCode()
        }
    }, [code])
    

    const joinRoom = async(room: any) => {
        try {
            const res = await axios.post(`/room/add-user/${room.id}`, {
                userId: user.id,
                type: 'user'
            })
            console.log(res.data)
            if(res.data) {
                setJoinRoomResponse(res.data)
                socket.emit('room:user-added', { roomId: room.id })
            }
            
        } catch (err) {
            setJoinRoomResponse(err)
        }
    }

    return (
        <>
            <Head>
                <title>Nest Next Boilerplate</title>
                <meta name="description" content="Welcome to Witq"/>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container defaultHeight={false}>
                <div>
                    <div>
                    {ApiResponse &&
                        <>
                            <div className="min-h-[40vh]hero bg-base-200">
                                <div className="flex-col">
                                    <section>
                                        <div className="flex flex-col px-5 py-8 sm:px-6 lg:px-8">
                                            <div className="flex flex-col items-center w-full max-w-3xl mx-auto prose prose-blue">
                                                <div className="w-full">
                                                    <h1>{ApiResponse.room.name}</h1>
                                                    <p>{ApiResponse.room.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex pb-6 flex-col items-center my-5 max-w-7xl sm:flex-row lg:mx-[8rem]">
                                                <div className="inline-flex flex-shrink-0 w-20 h-20 rounded-full text-neutral-600 sm:mr-10">
                                                    <img className="mask mask-squircle" src={ApiResponse.room.owner.image}/>
                                                </div>
                                                <div className="flex-grow mt-6 prose text-center sm:text-left sm:mt-0 prose-md">
                                                <h2>Owned by:</h2>
                                                <p>{ApiResponse.room.owner.displayName}</p>
                                                </div>
                                            </div>
                                            <div className="flex pb-6 flex-col items-center my-5 max-w-7xl sm:flex-row lg:mx-[8rem]">
                                                <div className="inline-flex flex-shrink-0 w-20 h-20 rounded-full text-neutral-600 sm:mr-10">
                                                    <img className="mask mask-squircle" src={ApiResponse.user.image}/>
                                                </div>
                                                <div className="flex-grow mt-6 prose text-center sm:text-left sm:mt-0 prose-md">
                                                <h2>Invited by:</h2>
                                                <p>{ApiResponse.user.displayName}</p>
                                                </div>
                                            </div>
                                            {JoinRoomResponse &&
                                                <div className="p-4 mx-auto my-10 text-sm font-bold border text-success rounded-xl border-success">
                                                    <p className="text-sm">{JoinRoomResponse.message}</p>
                                                </div>
                                            }
                                            <div className="flex flex-col items-center pb-10 mx-auto my-10 max-w-7xl sm:flex-row">
                                                <button onClick={() => joinRoom(ApiResponse.room)} className="w-64 btn btn-lg">Join</button>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </>
                    }
                    </div>
                </div>
            </Container>
        </>
    )
}

export default Index