import Head from 'next/head'
import Image from 'next/image'
import { BsInfoLg } from 'react-icons/bs'
import { useSelector } from 'react-redux'

import { Container } from '../components/Container'
import EditProfileForm from '../components/EditProfileForm'
import { RootState } from '../store/store'
import { AuthOption, withAuth } from '../utils/withAuth'

interface MeProps {

}

const Me: React.FC<MeProps> = ({}) => {
    let userState = useSelector((state: RootState) => state.user)
    const { user, authenticated } = userState
    
    return (
        <>
            <Head>
                <title>Profile</title>
                <meta name="description" content="Profile page" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container>
                    {authenticated && user !== null ?
                    <div className="p-5 mx-auto my-5">
                        <div className="md:flex no-wrap md:-mx-2">
                            <div className="w-full md:w-3/12 md:mx-2">
                                <div className="p-3 rounded-lg h-72 bg-base-300">
                                    <div className="flex justify-center align-center">
                                        <div className="avatar">
                                            <div className="w-full rounded-lg">
                                                <Image src={user.image} width="100" height="100"/>
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-center mx-auto align-center">
                                            <h1 className="mb-4 font-bold text-md">{user.displayName}</h1>
                                            <h1 className="text-md">{user.role}</h1>
                                        </div>
                                    </div>
                                    <ul className="px-3 py-2 mt-3 divide-y rounded shadow-sm hover:shadow">
                                        <li className="flex items-center py-3">
                                            <span>Status</span>
                                            <span className="ml-auto"><span className="px-2 py-1 text-sm uppercase rounded">{user.accountStatus}</span></span>
                                        </li>
                                        <li className="flex items-center py-3">
                                            <span>Created:</span>
                                            <span className="ml-auto">{new Date(user.createdAt).toLocaleDateString()}</span>
                                        </li>
                                        <li className="flex items-center py-3">
                                            <span>Updated:</span>
                                            <span className="ml-auto">{new Date(user.updatedAt).toLocaleDateString()}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="my-4" />
                            </div>
                            <div className="w-full lg:mx-2 md:w-9/12">
                                <div className="p-3 rounded-lg shadow-sm bg-base-300 lg:h-72">
                                    <div className="flex items-center space-x-2 font-semibold leading-8">
                                        <span className="text-lg">
                                            <BsInfoLg/>
                                        </span>
                                        <span className="tracking-wide">About</span>
                                    </div>
                                    <div>
                                    <div className="grid grid-cols-2">
                                                <div className="px-4 py-2 font-semibold">ID</div>
                                                <div className="px-4 py-2">{user.id}</div>
                                            </div>
                                        <div className="grid text-sm md:grid-cols-2">
                                            <div className="grid grid-cols-2">
                                                <div className="px-4 py-2 font-semibold">First Name</div>
                                                <div className="px-4 py-2">{user.firstName}</div>
                                            </div>
                                            <div className="grid grid-cols-2">
                                                <div className="px-4 py-2 font-semibold">Last Name</div>
                                                <div className="px-4 py-2">{user.lastName}</div>
                                            </div>
                                            <div className="grid grid-cols-2">
                                                <div className="px-4 py-2 font-semibold">Nick name</div>
                                                <div className="px-4 py-2">{user.displayName}</div>
                                            </div>
                                            <div className="grid grid-cols-2">
                                                <div className="px-4 py-2 font-semibold">Email</div>
                                                <div className="px-4 py-2">
                                                    <a href="mailto:jane@example.com">{user.email}</a>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2">
                                                <div className="px-4 py-2 font-semibold">Provider</div>
                                                <div className="px-4 py-2">{user.provider}</div>
                                            </div>
                                            <div className="grid grid-cols-2">
                                                <div className="px-4 py-2 font-semibold">Provider ID</div>
                                                <div className="px-4 py-2">{user.providerId}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <label htmlFor="edit-modal" className="w-full p-3 my-4 text-sm font-semibold rounded-lg btn modal-button focus:outline-none focus:shadow-outline hover:shadow-xs">More</label>
                                </div>
                            <div className="my-4" />
                            </div>
                        </div>
                    </div>
                : null

                }
            </Container>
            <input type="checkbox" id="edit-modal" className="modal-toggle" />
            <div className="modal">
            <div className="modal-box">
            <label htmlFor="edit-modal" className="absolute btn btn-sm btn-circle right-2 top-2">✕</label>
                <EditProfileForm/>
            </div>
            </div>
        </>
    )
}

export default withAuth(AuthOption.REQUIRED, Me)