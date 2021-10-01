import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import { NavBar } from '../components/NavBar'
import axios from 'axios'
import { useRouter } from 'next/router'
import { AuthProvider } from '../context/auth'

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
    const authRoutes = ['/register', '/login', '/login/success', '/login/error']
    const authRoute = authRoutes.includes(pathname)

    return (
        <SWRConfig value={{
            fetcher,
            dedupingInterval: 5000
        }}>
            <AuthProvider>
                {!authRoute && <NavBar/>}
                <Component {...pageProps} />
            </AuthProvider>
        </SWRConfig>
    )
}
  
export default  MyApp
