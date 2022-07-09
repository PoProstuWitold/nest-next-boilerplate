import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import axios from 'axios'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { getPersistor } from '@rematch/persist'
import { useRouter } from 'next/router'
import { ThemeProvider } from 'next-themes'
import { Provider } from 'react-redux'
import { IoProvider } from 'socket.io-react-hook'

import { AuthProvider } from '../store/auth'
import { Footer } from '../components/Footer'
import { store } from '../store/store'
import { NavBar } from '../components/NavBar'


const persistor = getPersistor()

axios.defaults.baseURL = 'http://localhost:4000/api/v1'
axios.defaults.withCredentials = true

const fetcher = async (url: string) => {
    try {
        const res = await axios.get(url)
        return res.data
    } catch (err: any) {
        throw err.response.data
    }
}

const MyApp = ({ Component, pageProps }: AppProps) => {
    
    const { pathname } = useRouter()
    const authRoutes = ['/login', '/account/password/reset']
    const authRoute = authRoutes.includes(pathname)

    return (
        <SWRConfig value={{
            fetcher,
            dedupingInterval: 5000
        }}>
            <ThemeProvider>
                    <Provider store={store}>
                        <PersistGate persistor={persistor}>
                            <AuthProvider>
                                <IoProvider>
                                    {!authRoute && <NavBar/>}
                                    <Component {...pageProps}/>
                                    {!authRoute || pathname === '/chat' && <Footer/>}   
                                </IoProvider>                   
                            </AuthProvider>
                        </PersistGate>
                    </Provider>
            </ThemeProvider>
        </SWRConfig>
    )
}
  
export default MyApp
