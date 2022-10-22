import { Field, Form, Formik, FormikHelpers, FormikState } from 'formik'
import * as Yup from 'yup'

import { useAuthenticatedSocket } from '../../utils/useSocket'

interface MessageInputProps {
    chatId: string
    type: 'room' | 'conversation'
}

type MessageValues = {
    text: string
}

export const MessageInput: React.FC<MessageInputProps> = ({ chatId, type }) => {

    const { socket } = useAuthenticatedSocket('ws://localhost:4000/chat')
    const messageValues: MessageValues = { text: '' }
    const messageSchema = Yup.object().shape({
        text: Yup.string().required('Email cannot be empty or whitespace')
    })
    const submitMessage = async (values: MessageValues, helpers: FormikHelpers<MessageValues>) => {
        helpers.resetForm()
        setTimeout(() => helpers.setSubmitting(false), 2000)
        try {
            socket.emit('message:create', {
                message: values.text,
                chatId,
                type
            })
        } catch (err: any) {
            console.error('Submit Message Error', err)
        }
    }

    return (
        <>
        {/* //TO DO - 'user' is typing feautre
        <div className="flex items-center justify-between w-full pl-5 mb-2">
            typing
        </div> */}
        <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
            <Formik
                initialValues={messageValues} 
                onSubmit={submitMessage}
                validationSchema={messageSchema}
            >
            {({ isSubmitting }: FormikState<MessageValues>) => (
                <Form className="flex items-center justify-between w-full p-3 ">
                        <Field placeholder="Type your message" type="text" name="text" className={`block w-full outline-none transition duration-200 input`}/>
                        <button type="submit" disabled={isSubmitting} className="w-1/6 ml-6 btn">
                            Submit
                        </button>
                </Form>
            )}
            </Formik>
        </div>
        </>
    )
}