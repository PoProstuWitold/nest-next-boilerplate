import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import { NavBar } from '../components/NavBar'
import axios from 'axios'
import { AuthProvider } from '../store/auth'
import { ThemeProvider } from 'next-themes'
import { Footer } from '../components/Footer'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { getPersistor } from '@rematch/persist'
import { useRouter } from 'next/router'

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
    
    const router = useRouter()

    return (
        <SWRConfig value={{
            fetcher,
            dedupingInterval: 5000
        }}>
            <ThemeProvider>
                    <Provider store={store}>
                        <PersistGate persistor={persistor}>
                            <AuthProvider>
                                {router.pathname !== '/login' && <NavBar/>}
                                <Component {...pageProps}/>
                                {router.pathname !== '/login' && <Footer/>}                      
                            </AuthProvider>
                        </PersistGate>
                    </Provider>
            </ThemeProvider>
        </SWRConfig>
    )
}
  
export default  MyApp
