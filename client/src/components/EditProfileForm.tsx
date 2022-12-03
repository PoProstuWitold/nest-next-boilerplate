import { Formik, Form, Field, FormikState, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios, { AxiosError } from 'axios'
import { AiTwotoneEdit } from 'react-icons/ai'
import Link from 'next/link'

import { Dispatch, RootState } from '../store/store'
import { AuthOption, withAuth } from '../utils/withAuth'
import { ErrorField } from '../components/ErrorField'


interface EditProfileProps {

}

type UpdateValues = {
    firstName: string | null;
    lastName: string | null;
    displayName: string | null;
}


const EditProfileForm: React.FC<EditProfileProps> = ({}) => {

    const [ApiErrors, setAPIErrors] = useState<any>({})
    const [ApiResponse, setAPIResponse] = useState<any>('')
    const dispatch = useDispatch<Dispatch>()
    
    let userState = useSelector((state: RootState) => state.user)
    const { user, authenticated } = userState
    let updateValues: UpdateValues
    
    updateValues = {
        firstName: '',
        lastName: '',
        displayName: ''
    }

    if(user) {
        updateValues = {
            firstName: user.firstName,
            lastName: user.lastName,
            displayName: user.displayName
        }
    }

    const updateSchema = Yup.object().shape({
        firstName: Yup.string().required('First name cannot be empty or whitespace').min(2, 'First name must be between 3 and 30 characters long').max(30, 'First name must be between 3 and 30 characters long'),
        lastName: Yup.string().required('Last name cannot be empty or whitespace').min(3, 'Last name must be between 3 and 50 characters long').max(50, 'Last name must be between 3 and 50 characters long'),
        displayName: Yup.string().required('Display name cannot be empty or whitespace').min(3, 'Display name must be between 3 and 30 characters long').max(50, 'Display name must be between 3 and 30 characters long')
    })
    
    const submitUpdateForm = async (values: UpdateValues, helpers: FormikHelpers<UpdateValues>) => {
        try {
            const res = await axios.patch('/user/update', values)
            setAPIResponse(res.data)
            dispatch.user.getUserProfileAsync()
            let userState = useSelector((state: RootState) => state.user)
            const { user } = userState
            
            if(user) {
                setAPIResponse('')
                setAPIErrors({})
                helpers.setValues({
                    displayName: user.displayName,
                    firstName: user.firstName,
                    lastName: user.lastName
                })
            }
            
        } catch (err) {
            if(err instanceof AxiosError) {
                setAPIResponse(err!.response!.data)
                setAPIErrors(err!.response!.data.errors)
            }
        }
    }


    const resendConfirmationToken = async () => {
        try {
            const res = await axios.get('/auth/account/confirm-resend')
            setAPIResponse(res.data)
            console.log(res)
        } catch (err) {
            if(err instanceof AxiosError) {
                setAPIResponse(err.response!.data)
                console.log(err.response!.data)
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
                        initialValues={updateValues} 
                        onSubmit={submitUpdateForm}
                        validationSchema={updateSchema}
                    >
                        {({ isSubmitting, errors, touched }: FormikState<UpdateValues>) => (
                            <Form>
                                <div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="font-semibold label-text">First name</span>
                                        </label>
                                        <Field placeholder="Enter your first name" type="text" name="firstName" className={`w-full p-3 transition duration-200 rounded input`}/>
                                        <label className="label">
                                            {errors.firstName && touched.firstName ? <ErrorField error={errors.firstName}/> : null}
                                            {ApiErrors.firstName && touched.firstName ? <ErrorField error={ApiErrors.firstName}/> : null}
                                        </label>
                                        
                                    </div>
                                </div>
                                <div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="font-semibold label-text">Last name</span>
                                        </label>
                                        <Field placeholder="Enter your last name" type="text" name="lastName" className={`w-full p-3 transition duration-200 rounded input`}/>
                                        <label className="label">
                                            {errors.lastName && touched.lastName ? <ErrorField error={errors.lastName}/> : null}
                                            {ApiErrors.lastName && touched.lastName ? <ErrorField error={ApiErrors.lastName}/> : null}
                                        </label>
                                        
                                    </div>
                                </div>
                                <div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="font-semibold label-text">Display name</span>
                                        </label>
                                        <Field placeholder="Enter your nick name" type="text" name="displayName" className={`w-full p-3 transition duration-200 rounded input`}/>
                                        <label className="label">
                                            {errors.displayName && touched.displayName ? <ErrorField error={errors.displayName}/> : null}
                                            {ApiErrors.displayName && touched.displayName ? <ErrorField error={ApiErrors.displayName}/> : null}
                                        </label>
                                        
                                    </div>
                                </div>
                                {user.provider === 'local' ?
                                <div>
                                    <div className="flex flex-row items-stretch">
                                        <Link href="/account/password/change">
                                            <a className="mb-6 font-semibold btn-ghost btn-sm rounded-btn btn btn-outline label-text">
                                                Change password
                                            </a>
                                        </Link>
                                    </div>
                                </div>
                                : null
                                }
                                {user?.accountStatus !== 'verified' ?
                                    <div>
                                        <div className="flex flex-row items-stretch">
                                                <span onClick={resendConfirmationToken} className="mb-6 font-semibold btn-ghost btn-sm rounded-btn btn btn-outline label-text">
                                                    Resend verification token
                                                </span>
                                        </div>
                                    </div> : null
                                }
                                
                                <button type="submit" disabled={isSubmitting} className={`w-full btn font-semibold ${isSubmitting ? 'btn loading' : ''}`}>
                                    <AiTwotoneEdit/> <p className="ml-2">Edit</p>
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

export default withAuth(AuthOption.REQUIRED, EditProfileForm)