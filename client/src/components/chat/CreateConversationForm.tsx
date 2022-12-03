import { Formik, Form, Field, FormikState, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { useSelector } from 'react-redux'
import { AiTwotoneEdit } from 'react-icons/ai'

import { RootState } from '../../store/store'
import { ErrorField } from '../../components/ErrorField'
import { useAuthenticatedSocket } from '../../utils/useSocket'
import { useEffect, useState } from 'react'


type ConversastionValues = {
    creator: string | null,
    participant: string | null
}

interface CreateConversationFormProps {

}

export const CreateConversationForm: React.FC<CreateConversationFormProps> = ({}) => {
    const { socket } = useAuthenticatedSocket('ws://localhost:4000/chat')
    
    let userState = useSelector((state: RootState) => state.user)
    const { user, authenticated } = userState

    if(!user) {
        return <></>
    }

    const createConversationValues: ConversastionValues = {
        creator: user.displayName,
        participant: '',
    }

    const [wsError, setWsError] = useState<any>('')

    const createConversationSchema = Yup.object().shape({
        participant: Yup.string()
    })
    
    useEffect(() => {
        if(socket) {
            socket.on('connect', () => {
                console.log('Socket connected')
            })
          
            socket.on('disconnect', () => {
                console.log('Socket disconnected')
            })

            socket.on('error:conversation-create', async (error) => {
                console.log('error:conversation-create', error)
                setWsError(error)
            })

            return () => {
                socket.off('connect')
                socket.off('disconnect')
                socket.off('error:conversation-create')
            }
        }
    }, [socket])

    const submitConversation = async (values: ConversastionValues, helpers: FormikHelpers<ConversastionValues>) => {
        try {
            socket.emit('conversation:create', values)
            setTimeout(() => {
                helpers.resetForm()
                setWsError('')
            }, 3000)
        } catch (err) {
            console.error(err)
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
                        initialValues={createConversationValues} 
                        onSubmit={submitConversation}
                        validationSchema={createConversationSchema}
                    >
                        {({ isSubmitting, errors, touched }: FormikState<ConversastionValues>) => (
                            <Form>
                                <div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="font-semibold label-text">Creator</span>
                                        </label>
                                        <span className="font-semibold label-text">{user.displayName}</span>    
                                    </div>
                                </div>
                                <div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="font-semibold label-text">Participant</span>
                                        </label>
                                        <Field placeholder="Enter exact chat participant name" type="text" name="participant" className={`w-full p-3 transition duration-200 rounded input`}/>
                                        <label className="label">
                                            {errors.participant && touched.participant ? <ErrorField error={errors.participant}/> : null}
                                            {wsError && wsError.response && wsError.response.errors && wsError.response.errors.participant ? <ErrorField error={wsError.response.errors.participant}/> : null}
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