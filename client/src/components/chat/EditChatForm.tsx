import { Formik, Form, Field, FormikState, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { useSelector } from 'react-redux'
import { AiTwotoneEdit } from 'react-icons/ai'

import { RootState } from '../../store/store'
import { ErrorField } from '../../components/ErrorField'
import { useAuthenticatedSocket } from '../../utils/useSocket'
import { useEffect, useState } from 'react'

type ChatRoomValues = {
    name: string | null;
    description: string | null;
    isPublic: boolean | null;
}

interface EditChatFormProps {}

export const EditChatForm: React.FC<EditChatFormProps> = () => {
    let roomState = useSelector((state: RootState) => state.room)
    const { activeRoom } = roomState
    
    const { socket } = useAuthenticatedSocket('ws://localhost:4000/chat')
    
    let userState = useSelector((state: RootState) => state.user)
    const { user, authenticated } = userState
    let editChatRoomValues: ChatRoomValues = {
        name: '',
        description: '',
        isPublic: true,
    }

    if(!activeRoom) {
        return <></>
    }

    if(activeRoom) {
        editChatRoomValues = {
            name: activeRoom.name,
            description: activeRoom.description,
            isPublic: activeRoom.isPublic,
        }
    }

    const [wsError, setWsError] = useState<any>('')

    const editChatRoomSchema = Yup.object().shape({
        name: Yup.string(),
        description: Yup.string(),
        isPublic: Yup.boolean()
    })
    

    useEffect(() => {
        if(socket) {
            socket.on('connect', () => {
                console.log('Socket connected')
            })
          
            socket.on('disconnect', () => {
                console.log('Socket disconnected')
            })

            socket.on('error:room-edit', async (error) => {
                console.log('error', error)
                setWsError(error)
            })

            console.log(activeRoom)

            return () => {
                socket.off('connect')
                socket.off('disconnect')
                socket.off('error')
            }
        }
    }, [socket])

    const submitChatRoom = async (values: ChatRoomValues, helpers: FormikHelpers<ChatRoomValues>) => {
        try {
            const { name, description, isPublic } = values
            socket.emit('room:edit', { name, description, isPublic, roomId: activeRoom.id })
            setTimeout(() => {
                helpers.resetForm()
                setWsError('')
            }, 3000)
        } catch (err) {
            console.log(err)
        }
    }

    const deleteRoom = () => {
        socket.emit('room:delete', { roomId: activeRoom.id, owner: activeRoom.owner })
    }

    return (
        <>
            <div>
                    <div className="mx-auto w-96">
                    <p className="m-10 mx-auto text-lg font-bold text-center">Chat: {activeRoom.name}</p>
                    {wsError ? <p className="p-4 m-10 mx-auto font-bold text-center border rounded-xl border-error text-md text-error">{wsError.name}</p> : null}
                    {authenticated && user !== null ? 
                    <Formik
                        enableReinitialize
                        initialValues={editChatRoomValues} 
                        onSubmit={submitChatRoom}
                        validationSchema={editChatRoomSchema}
                    >
                        {({ isSubmitting, errors, touched }: FormikState<ChatRoomValues>) => (
                            <Form>
                                <div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="font-semibold label-text">Chat name</span>
                                        </label>
                                        <Field placeholder="Enter your chat name" type="text" name="name" className={`w-full p-3 transition duration-200 rounded input`}/>
                                        <label className="label">
                                            {errors.name && touched.name ? <ErrorField error={errors.name}/> : null}
                                            {wsError && wsError.response.errors.name && touched.name ? <ErrorField error={wsError.response.errors.name}/> : null}
                                        </label>
                                        
                                    </div>
                                </div>
                                <div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="font-semibold label-text">Chat description</span>
                                        </label>
                                        <Field placeholder="Enter your chat description" type="text" name="description" className={`w-full p-3 transition duration-200 rounded input`}/>
                                        <label className="label">
                                            {errors.description && touched.description ? <ErrorField error={errors.description}/> : null}
                                            {wsError && wsError.response.errors.description && touched.description ? <ErrorField error={wsError.response.errors.description}/> : null}
                                        </label>
                                        
                                    </div>
                                </div>
                                <div>
                                    <div className="form-control">
                                        <label className="cursor-pointer label">
                                            <span className="font-semibold label-text">Public</span> 
                                            <Field placeholder="Enter your chat access" type="checkbox" name="isPublic" className={`checkbox`}/>
                                        </label>
                                        <label className="label">
                                            {errors.isPublic && touched.isPublic ? <ErrorField error={errors.isPublic}/> : null}
                                            {wsError && wsError.response.errors.isPublic && touched.isPublic ? <ErrorField error={wsError.response.errors.isPublic}/> : null}
                                        </label>
                                        
                                    </div>
                                </div>
                                
                                {activeRoom && activeRoom.owner.id === user.id ?
                                    <div>
                                        <div className="flex flex-row items-stretch">
                                                <span onClick={deleteRoom} className="mb-6 font-semibold btn-ghost btn-sm rounded-btn btn btn-outline label-text">
                                                    Delete room
                                                </span>
                                        </div>
                                    </div> : null
                                }

                                <button type="submit" disabled={isSubmitting} className={`w-full btn font-semibold ${isSubmitting ? 'btn loading' : ''}`}>
                                    <AiTwotoneEdit/> <p className="ml-2">Edit chatroom</p>
                                </button>
                            </Form>
                        )}
                    </Formik> : null    
                    }
                    </div>
            </div>
        </>
    )
}