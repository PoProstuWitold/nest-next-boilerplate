import { Formik, Form, Field, FormikState, FormikHelpers } from 'formik'
import Head from 'next/head'
import * as Yup from 'yup'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { SocialLogin } from '../../components/SocialLogin'
import { Dispatch } from '../../store/store'
import { mapErrors } from '../../utils/mapErrors'
import { AuthOption, withAuth } from '../../utils/withAuth'
import {AiFillEyeInvisible, AiFillEye} from 'react-icons/ai'
import { FiArrowLeft } from 'react-icons/fi'
import { SERVER_URL } from '../../utils/constants'
import Link from 'next/link'

interface LoginProps {

}

type LoginValues = {
    email: string;
    password: string;
}

type RegisterValues = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    displayName: string;
}


const Login: React.FC<LoginProps> = ({}) => {

    const [FormType, setFormType] = useState<'login' | 'register'>('login')
    const [open, setOpen] = useState<boolean>(false)
    const [ApiErrors, setAPIErrors] = useState<any>({})
    const dispatch = useDispatch<Dispatch>()
    const router = useRouter()


    const toggle = () =>{
        setOpen(!open)
    }



    const loginValues: LoginValues = { email: '', password: '' }
    const loginSchema = Yup.object().shape({
        email: Yup.string().email('Email should be email').required('Email cannot be empty or whitespace'),
        password: Yup.string().required('Password cannot be empty or whitespace').min(6, 'Password must be between 6 and 100 characters long').max(100, 'Password must be between 6 and 100 characters long')
    })
    const submitLoginForm = async (values: LoginValues, helpers: FormikHelpers<LoginValues>) => {
        console.log(values)
        setTimeout(() => helpers.setSubmitting(false), 2000)
        try {
            const res = await dispatch.user.localLoginAsync(values)
            console.log(res)
            if(res.errors) {
                setAPIErrors(mapErrors(res.errors))
                console.log('ApiErrors', ApiErrors)
            }
            console.log('ApiErrors', ApiErrors)
            if(res.user) {
                router.push('/me')
            }
            console.log('ApiErrors', ApiErrors)
        } catch (err: any) {
            console.log('ERROR', err)
        }
    }



    const registerValues: RegisterValues = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        displayName: ''
    }
    const registerSchema = Yup.object().shape({
        email: Yup.string().email('Email should be email').required('Email cannot be empty or whitespace'),
        password: Yup.string().required('Password cannot be empty or whitespace').min(6, 'Password must be between 6 and 100 characters long').max(100, 'Password must be between 6 and 100 characters long'),
        firstName: Yup.string().required('First name cannot be empty or whitespace').min(2, 'First name must be between 3 and 30 characters long').max(30, 'First name must be between 3 and 30 characters long'),
        lastName: Yup.string().required('Last name cannot be empty or whitespace').min(3, 'Last name must be between 3 and 50 characters long').max(50, 'Last name must be between 3 and 50 characters long'),
        displayName: Yup.string().required('Display name cannot be empty or whitespace').min(3, 'Display name must be between 3 and 30 characters long').max(50, 'Display name must be between 3 and 30 characters long')
    })
    const submitRegisterForm = async (values: RegisterValues, helpers: FormikHelpers<RegisterValues>) => {
        console.log(values)
        setTimeout(() => helpers.setSubmitting(false), 2000)
        try {
            const res = await dispatch.user.localRegisterAsync(values)
            if(res.errors) {
                setAPIErrors(mapErrors(res.errors))
                console.log(ApiErrors)
            }

            if(res.user) {
                router.push('/me')
            }
        } catch (err: any) {
            console.log('ERROR', err)
        }
    }


    const changeForm = (formType: 'login' | 'register') => {
        setFormType(formType)
    }

    return (
        <>
            <Head>
                <title>Login</title>
                <meta name="description" content="Login or create account" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex w-full m-auto mt-0 lg:w-4/12 md:w-10/12 md:mt-28 bg-base-200 rounded-xl" >
                    <div className="mx-auto w-96">
                    <p className="m-10 mx-auto text-lg font-bold text-center">PoProstuWitold</p>
                    <div className="flex flex-row items-center justify-center w-full mx-auto mb-10">
                        <button onClick={() => changeForm('login')} className={`w-64 p-4 mr-4 text-center rounded-lg ${FormType === 'login' ? 'bg-primary' : ''}`}>Sign in</button>
                        <button onClick={() => changeForm('register')} className={`w-64 p-4 mr-4 text-center rounded-lg ${FormType === 'register' ? 'bg-primary' : ''}`}>Sign up</button>
                    </div>
                    {FormType && FormType === 'login' ?
                        <Formik
                            initialValues={loginValues} 
                            onSubmit={submitLoginForm}
                            validationSchema={loginSchema}
                        >
                            {({ isSubmitting, errors, touched }: FormikState<LoginValues>) => (
                                <Form>
                                    <div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="font-semibold label-text">Email</span>
                                                <span className="font-medium label-text-alt">e.g. john@gmail.com</span>
                                            </label>
                                            <Field placeholder="Enter your email" type="email" name="email" className={`w-full p-3 transition duration-200 rounded input`}/>
                                            <label className="label">
                                                {errors.email && touched.email ? <span className="italic label-text-alt">{errors.email}</span> : null}
                                                {ApiErrors.email && touched.email ? <span className="italic label-text-alt">{ApiErrors.email}</span> : null}
                                            </label>
                                            
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-control">
                                            <label className="relative label">
                                                <span className="font-semibold label-text">Password</span>
                                                <span className="font-medium label-text-alt">e.g. K3ybo@rdC@t</span>
                                                <div className='absolute text-2xl top-12 right-5'>
                                                    {
                                                        (open === false) ? <AiFillEye onClick={toggle}/> :
                                                        <AiFillEyeInvisible onClick={toggle}/>
    
                                                    }
                                                </div>
                                            </label>
                                            <Field placeholder="Enter your password" type={(open === false)? 'password' :'text'} name="password" className={`w-full p-3 transition duration-200 rounded input`}/>
                                            
                                            <label className="label">
                                                {errors.password ? <span className="italic label-text-alt">{errors.password}</span> : null}
                                                {ApiErrors.password ? <span className="italic label-text-alt">{ApiErrors.password}</span> : null}
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <button type="submit" disabled={isSubmitting} className="w-full btn">
                                        Submit
                                    </button>
                                </Form>
                            )}
                        </Formik> : null
                        }
                        {FormType && FormType === 'register' ?
                        <Formik
                            initialValues={registerValues} 
                            onSubmit={submitRegisterForm}
                            validationSchema={registerSchema}
                        >
                            {({ isSubmitting, errors, touched }: FormikState<RegisterValues>) => (
                                <Form>
                                    <div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="font-semibold label-text">Email</span>
                                                <span className="font-medium label-text-alt">e.g. john@gmail.com</span>
                                            </label>
                                            <Field placeholder="Enter your email" type="email" name="email" className={`w-full p-3 transition duration-200 rounded input`}/>
                                            <label className="label">
                                                {errors.email && touched.email ? <span className="italic label-text-alt">{errors.email}</span> : null}
                                                {ApiErrors.email && touched.email ? <span className="italic label-text-alt">{ApiErrors.email}</span> : null}
                                            </label>
                                            
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-control">
                                            <label className="relative label">
                                                <span className="font-semibold label-text">Password</span>
                                                <span className="font-medium label-text-alt">e.g. K3ybo@rdC@t</span>
                                                <div className='absolute text-2xl top-12 right-5'>
                                                    {
                                                        (open === false) ? <AiFillEye onClick={toggle}/> :
                                                        <AiFillEyeInvisible onClick={toggle}/>
    
                                                    }
                                                </div>
                                            </label>
                                            <Field placeholder="Enter your password" type={(open === false)? 'password' :'text'} name="password" className={`w-full p-3 transition duration-200 rounded input`}/>
                                            
                                            <label className="label">
                                                {errors.password ? <span className="italic label-text-alt">{errors.password}</span> : null}
                                                {ApiErrors.password ? <span className="italic label-text-alt">{ApiErrors.password}</span> : null}
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="font-semibold label-text">First name</span>
                                                <span className="font-medium label-text-alt">e.g. John</span>
                                            </label>
                                            <Field placeholder="Enter your first name" type="text" name="firstName" className={`w-full p-3 transition duration-200 rounded input`}/>
                                            <label className="label">
                                                {errors.firstName && touched.firstName ? <span className="italic label-text-alt">{errors.firstName}</span> : null}
                                                {ApiErrors.firstName && touched.firstName ? <span className="italic label-text-alt">{ApiErrors.firstName}</span> : null}
                                            </label>
                                            
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="font-semibold label-text">Last name</span>
                                                <span className="font-medium label-text-alt">e.g. Kovalsky</span>
                                            </label>
                                            <Field placeholder="Enter your last name" type="text" name="lastName" className={`w-full p-3 transition duration-200 rounded input`}/>
                                            <label className="label">
                                                {errors.lastName && touched.lastName ? <span className="italic label-text-alt">{errors.lastName}</span> : null}
                                                {ApiErrors.lastName && touched.lastName ? <span className="italic label-text-alt">{ApiErrors.lastName}</span> : null}
                                            </label>
                                            
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="font-semibold label-text">Display name</span>
                                                <span className="font-medium label-text-alt">e.g. JohnKov1337</span>
                                            </label>
                                            <Field placeholder="Enter your nick name" type="text" name="displayName" className={`w-full p-3 transition duration-200 rounded input`}/>
                                            <label className="label">
                                                {errors.displayName && touched.displayName ? <span className="italic label-text-alt">{errors.displayName}</span> : null}
                                                {ApiErrors.displayName && touched.displayName ? <span className="italic label-text-alt">{ApiErrors.displayName}</span> : null}
                                            </label>
                                            
                                        </div>
                                    </div>
                                    
                                    <button type="submit" disabled={isSubmitting} className="w-full btn">
                                        Submit
                                    </button>
                                </Form>
                            )}
                        </Formik> : null
                        }
                        <div className="my-10 divider">OR</div>
                        <section className="box-border flex flex-wrap">
                            <SocialLogin className="w-64 mr-4" provider="Google" url={`${SERVER_URL}/auth/google`}/>
                            <SocialLogin className="w-64" provider="Facebook" url={`${SERVER_URL}/auth/facebook`}/>
                        </section>
                    </div>
            </div>    
            <div className="flex w-full m-auto mt-8 lg:w-4/12 md:w-10/12">
                <Link href="/">
                    <a className="m-auto mb-10 text-xl btn btn-ghost btn-sm rounded-btn lg:m-0 btn-primary btn-outline">
                        <FiArrowLeft/> Back to main site
                    </a>
                </Link>
            </div>
        </>
    )
}

export default withAuth(AuthOption.FORBIDDEN, Login)