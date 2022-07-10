import { Formik, Form, Field, FormikState, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import axios, { AxiosError } from 'axios'
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
    const [ApiErrors, setAPIErrors] = useState<any>({})
    const [ApiResponse, setAPIResponse] = useState<any>('')
    
    let userState = useSelector((state: RootState) => state.user)
    const { user, authenticated } = userState
    let createChatRoomValues: ChatRoomValues
    
    createChatRoomValues = {
        name: '',
        description: '',
        isPublic: true
    }

    const createChatRoomSchema = Yup.object().shape({
        name: Yup.string(),
        description: Yup.string(),
        isPublic: Yup.boolean()
    })
    
    const submitChatRoom = async (values: ChatRoomValues, helpers: FormikHelpers<ChatRoomValues>) => {
        try {
            console.log(values)
            // const res = await axios.post('/room', values)
            // setAPIResponse(res.data)
            socket.emit('room:create', values)
            
        } catch (err) {
            console.log(err)
            if(err instanceof AxiosError) {
                setAPIResponse(err!.response!.data)
                setAPIErrors(err!.response!.data.errors)
            }
        }
    }

    return (
        <>
            <div>
                    <div className="mx-auto w-96">
                    <p className="m-10 mx-auto text-lg font-bold text-center">PoProstuWitold</p>
                    {ApiResponse.success ? <p className="p-4 m-10 mx-auto font-bold text-center border text-md text-success rounded-xl border-success">{ApiResponse.message}</p> : (ApiResponse.message ? <p className="p-4 m-10 mx-auto font-bold text-center border rounded-xl border-error text-md text-error">{ApiResponse.message}</p> : null)}
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
                                        <Field placeholder="Enter your first name" type="text" name="name" className={`w-full p-3 transition duration-200 rounded input`}/>
                                        <label className="label">
                                            {errors.name && touched.name ? <ErrorField error={errors.name}/> : null}
                                            {ApiErrors.name && touched.name ? <ErrorField error={ApiErrors.name}/> : null}
                                        </label>
                                        
                                    </div>
                                </div>
                                <div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="font-semibold label-text">Chat description</span>
                                        </label>
                                        <Field placeholder="Enter your last name" type="text" name="description" className={`w-full p-3 transition duration-200 rounded input`}/>
                                        <label className="label">
                                            {errors.description && touched.description ? <ErrorField error={errors.description}/> : null}
                                            {ApiErrors.description && touched.description ? <ErrorField error={ApiErrors.description}/> : null}
                                        </label>
                                        
                                    </div>
                                </div>
                                <div>
                                    <div className="form-control">
                                        <label className="cursor-pointer label">
                                            <span className="font-semibold label-text">Public</span> 
                                            <Field placeholder="Enter your nick name" type="checkbox" name="isPublic" className={`checkbox`}/>
                                        </label>
                                        <label className="label">
                                            {errors.isPublic && touched.isPublic ? <ErrorField error={errors.isPublic}/> : null}
                                            {ApiErrors.isPublic && touched.isPublic ? <ErrorField error={ApiErrors.isPublic}/> : null}
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