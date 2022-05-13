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
    
    return (
        <SWRConfig value={{
            fetcher,
            dedupingInterval: 5000
        }}>
            <ThemeProvider>
                    <Provider store={store}>
                        <PersistGate persistor={persistor}>
                            <AuthProvider>
                                <NavBar/>
                                <Component {...pageProps}/>
                                <Footer/>
                            </AuthProvider>
                        </PersistGate>
                    </Provider>
            </ThemeProvider>
        </SWRConfig>
    )
}
  
export default  MyApp
