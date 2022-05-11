import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import { NavBar } from '../components/NavBar'
import axios from 'axios'
import { useRouter } from 'next/router'
import { AuthProvider } from '../context/auth'
import { useEffect, useState } from 'react'
import { ThemeProvider } from 'next-themes'
import Footer from '../components/Footer'

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
    const authRoutes = ['/login/success', '/login/error']
    const authRoute = authRoutes.includes(pathname)
    
    return (
        <SWRConfig value={{
            fetcher,
            dedupingInterval: 5000
        }}>
            <ThemeProvider>
                <AuthProvider>
                    <div>
                        {!authRoute && <NavBar/>}
                        <Component {...pageProps}/>
                        <Footer/>
                    </div>
                </AuthProvider>
            </ThemeProvider>
        </SWRConfig>
    )
}
  
export default  MyApp
