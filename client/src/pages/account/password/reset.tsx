import { Field, Form, Formik, FormikHelpers, FormikState } from 'formik'
import Head from 'next/head'
import Link from 'next/link'
import * as Yup from 'yup'
import { useState } from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import { ErrorField } from '../../../components/ErrorField'
import { AuthOption, withAuth } from '../../../utils/withAuth'
import axios from 'axios'

interface ResetProps {

}

type EmailValue = {
    email: string;
}

const Reset: React.FC<ResetProps> = ({}) => {

    const [open, setOpen] = useState<boolean>(false)
    const [ApiErrors, setAPIErrors] = useState<any>({})

    const emailValue: EmailValue = { email: '' }
    const emailSchema = Yup.object().shape({
        email: Yup.string().email('Email should be email').required('Email cannot be empty or whitespace')
    })
    const submitResetForm = async (values: EmailValue, helpers: FormikHelpers<EmailValue>) => {
        try {
            const res = await axios.patch('/auth/password/reset', {
                email: values.email
            })
            console.log(res.data)
        } catch (err) {
            
        }
    }

    return (
        <>
            <Head>
                <title>Password reset</title>
                <meta name="description" content="Profile page" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex w-full m-auto mt-0 shadow-xl lg:w-4/12 md:w-10/12 md:mt-28 bg-base-200 rounded-xl" >
                    <div className="mx-auto w-96">
                    <p className="m-10 mx-auto text-lg font-bold text-center">PoProstuWitold</p>
                        <Formik
                            initialValues={emailValue} 
                            onSubmit={submitResetForm}
                            validationSchema={emailSchema}
                        >
                            {({ isSubmitting, errors, touched }: FormikState<EmailValue>) => (
                                <Form>
                                    <div>
                                        <div className="form-control">
                                        <label className="label">
                                                <span className="font-semibold label-text">Recovery Email</span>
                                            </label>
                                            <Field placeholder="Enter your email" type="email" name="email" className={`w-full p-3 transition duration-200 rounded input`}/>
                                            <label className="label">
                                                {errors.email ? <ErrorField error={errors.email}/> : null}
                                            </label>
                                        </div>
                                    </div>
                                    <button type="submit" disabled={isSubmitting} className="w-full mb-5 btn">
                                        Reset password
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
            </div>    
            <div className="flex w-full m-auto mt-8 lg:w-4/12 md:w-10/12">
                <Link href="/login">
                    <a className="m-auto mb-10 text-xl shadow-xl btn btn-ghost btn-sm rounded-btn lg:m-0 btn-primary btn-outline">
                        <FiArrowLeft/> Back to login
                    </a>
                </Link>
            </div>
        </>
    )
}

export default withAuth(AuthOption.FORBIDDEN, Reset)