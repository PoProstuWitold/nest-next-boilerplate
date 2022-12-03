import { useEffect, useState } from 'react'
import { Formik, Form, Field, FormikState, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { useSelector } from 'react-redux'
import { AiTwotoneEdit } from 'react-icons/ai'

import { RootState } from '../../store/store'
import { ErrorField } from '../../components/ErrorField'
import { useAuthenticatedSocket } from '../../utils/useSocket'


type ChatRoomValues = {
    name: string | null;
    description: string | null;
    isPublic: boolean | null;
}

interface CreateChatFormProps {

}

export const CreateChatForm: React.FC<CreateChatFormProps> = ({}) => {
    const { socket } = useAuthenticatedSocket('ws://localhost:4000/chat')
    
    let userState = useSelector((state: RootState) => state.user)
    const { user, authenticated } = userState
    const createChatRoomValues: ChatRoomValues = {
        name: '',
        description: '',
        isPublic: true
    }

    const [wsError, setWsError] = useState<any>('')

    const createChatRoomSchema = Yup.object().shape({
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

            socket.on('error:room-create', async (error) => {
                console.log('error', error)
                setWsError(error)
            })

            return () => {
                socket.off('connect')
                socket.off('disconnect')
                socket.off('error')
            }
        }
    }, [socket])

    const submitChatRoom = async (values: ChatRoomValues, helpers: FormikHelpers<ChatRoomValues>) => {
        try {
            socket.emit('room:create', values)
            setTimeout(() => {
                helpers.resetForm()
                setWsError('')
            }, 3000)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <div>
                    <div className="mx-auto w-96">
                    <p className="m-10 mx-auto text-lg font-bold text-center">PoProstuWitold</p>
                    {wsError ? <p className="p-4 m-10 mx-auto font-bold text-center border rounded-xl border-error text-md text-error">{wsError.name}</p> : null}
                    {authenticated && user !== null ? 
                    <Formik
                        initialValues={createChatRoomValues} 
                        onSubmit={submitChatRoom}
                        validationSchema={createChatRoomSchema}
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
                                            {wsError && wsError.response.errors.name ? <ErrorField error={wsError.response.errors.name}/> : null}
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
                                            {wsError && wsError.response.errors.description ? <ErrorField error={wsError.response.errors.description}/> : null}
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
                                            {wsError && wsError.response.errors.isPublic ? <ErrorField error={wsError.response.errors.isPublic}/> : null}
                                        </label>
                                        
                                    </div>
                                </div>
                                
                                <button type="submit" disabled={isSubmitting} className={`w-full btn font-semibold ${isSubmitting ? 'btn loading' : ''}`}>
                                    <AiTwotoneEdit/> <p className="ml-2">Create chatroom</p>
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