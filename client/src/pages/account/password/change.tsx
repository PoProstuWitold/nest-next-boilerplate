import { Field, Form, Formik, FormikHelpers, FormikState } from 'formik'
import Head from 'next/head'
import * as Yup from 'yup'
import { useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import axios, { AxiosError } from 'axios'

import { ErrorField } from '../../../components/ErrorField'
import { AuthOption, withAuth } from '../../../utils/withAuth'
import { useDispatch } from 'react-redux'
import { Dispatch } from '../../../store/store'

interface ResetProps {

}

type PasswordValues = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}


const Reset: React.FC<ResetProps> = ({}) => {

    const dispatch = useDispatch<Dispatch>()
    const [open, setOpen] = useState<boolean>(false)
    const [ApiResponse, setAPIResponse] = useState<any>({})


    const toggle = () =>{
        setOpen(!open)
    }

    const passwordValues: PasswordValues = { oldPassword: '', newPassword: '', confirmPassword: ''}
    const passwordSchema = Yup.object().shape({
        oldPassword: Yup.string().required('Password cannot be empty or whitespace').min(6, 'Password must be between 6 and 100 characters long').max(100, 'Password must be between 6 and 100 characters long'),
        newPassword: Yup.string().required('Password cannot be empty or whitespace').min(6, 'Password must be between 6 and 100 characters long').max(100, 'Password must be between 6 and 100 characters long')
        .notOneOf([Yup.ref('oldPassword')], 'New password cannot be same as old password'),
        confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Password must match')
        .required('Password confirm is required'),
    })
    const submitChangeForm = async (values: PasswordValues, helpers: FormikHelpers<PasswordValues>) => {
        try {
            const res = await axios.patch('/auth/password/change', {
                oldPassword: values.oldPassword,
                newPassword: values.newPassword
            })
            helpers.resetForm()
            setAPIResponse(res.data)
            console.log(res.data)
            dispatch.user.getUserProfileAsync()
        } catch (err) {
            console.log(err)
            if(err instanceof AxiosError) {
                setAPIResponse(err!.response!.data)
            }
        }
    }

    return (
        <>
            <Head>
                <title>Change password</title>
                <meta name="description" content="Profile page" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="h-screen">
            <div className="flex w-full m-auto mt-0 shadow-xl lg:w-4/12 md:w-10/12 md:mt-28 bg-base-200 rounded-xl" >
                    <div className="mx-auto w-96">
                    <p className="m-10 mx-auto text-lg font-bold text-center">PoProstuWitold</p>
                    {ApiResponse.success ? <p className="p-4 m-10 mx-auto font-bold text-center border text-md text-success rounded-xl border-success">{ApiResponse.message}</p> : (ApiResponse.message ? <p className="p-4 m-10 mx-auto font-bold text-center border rounded-xl border-error text-md text-error">{ApiResponse.message}</p> : null)}
                    {ApiResponse.password ? <p className="p-4 m-10 mx-auto font-bold text-center border text-md text-error rounded-xl border-error">Invalid password</p> : null}
                        <Formik
                            initialValues={passwordValues} 
                            onSubmit={submitChangeForm}
                            validationSchema={passwordSchema}
                        >
                            {({ isSubmitting, errors }: FormikState<PasswordValues>) => (
                                <Form>
                                    <div>
                                        <div className="form-control">
                                            <label className="relative label">
                                                <span className="font-semibold label-text">Old Password</span>
                                                <div className='absolute text-2xl top-12 right-5'>
                                                    {
                                                        (open === false) ? <AiFillEye onClick={toggle}/> :
                                                        <AiFillEyeInvisible onClick={toggle}/>
                                                    }
                                                </div>
                                            </label>
                                            <Field placeholder="Enter old password" type={(open === false)? 'password' :'text'} name="oldPassword" className={`w-full p-3 transition duration-200 rounded input`}/>                                            
                                            <label className="label">
                                                {errors.oldPassword ? <ErrorField error={errors.oldPassword}/> : null}
                                            </label>
                                        </div>
                                        <div className="form-control">
                                            <label className="relative label">
                                                <span className="font-semibold label-text">New Password</span>
                                                <div className='absolute text-2xl top-12 right-5'>
                                                    {
                                                        (open === false) ? <AiFillEye onClick={toggle}/> :
                                                        <AiFillEyeInvisible onClick={toggle}/>
                                                    }
                                                </div>
                                            </label>
                                            <Field placeholder="Enter new password" type={(open === false)? 'password' :'text'} name="newPassword" className={`w-full p-3 transition duration-200 rounded input`}/>                                           
                                            <label className="label">
                                                {errors.newPassword ? <ErrorField error={errors.newPassword}/> : null}
                                            </label>
                                        </div>
                                        <div className="form-control">
                                            <label className="relative label">
                                                <span className="font-semibold label-text">Confirm New Password</span>
                                                <div className='absolute text-2xl top-12 right-5'>
                                                    {
                                                        (open === false) ? <AiFillEye onClick={toggle}/> :
                                                        <AiFillEyeInvisible onClick={toggle}/>
                                                    }
                                                </div>
                                            </label>
                                            <Field placeholder="Confirm your password" type={(open === false)? 'password' :'text'} name="confirmPassword" className={`w-full p-3 transition duration-200 rounded input`}/>
                                            <label className="label">
                                                {errors.confirmPassword ? <ErrorField error={errors.confirmPassword}/> : null}
                                            </label>
                                        </div>
                                    </div>
                                    <button type="submit" disabled={isSubmitting} className="w-full mb-5 btn">
                                        Change Password
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
            </div>
            </div>
        </>
    )
}

export default withAuth(AuthOption.REQUIRED, Reset)