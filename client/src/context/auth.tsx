import axios from 'axios'
import { createContext, useContext, useEffect, useReducer } from 'react'
import { User } from '../utils/types'

interface State {
    authenticated: boolean
    user: User | null
    loading: boolean
    provider: string | null
}

interface Action {
    type: string
    payload: any
}

const StateContext = createContext<State>({
    authenticated: false,
    user: null,
    loading: true,
    provider: null
})

const DispatchContext = createContext<any>(null)

const reducer = (state: State, { type, payload }: Action) => {
    switch (type) {
        case 'LOCAL_LOGIN':
            return {
                ...state,
                authenticated: true,
                user: payload,
                provider: 'local'
            }
        case 'LOCAL_REGISTER':
            return {
                ...state,
                authenticated: true,
                user: payload,
                provider: 'local'
            }
        case 'GOOGLE_AUTH':
            return {
                ...state,
                authenticated: true,
                user: payload,
                provider: 'google'
            }
        case 'FACEBOOK_AUTH':
            return {
                ...state,
                authenticated: true,
                user: payload,
                provider: 'facebook'
            }
        case 'LOGOUT':
            return { ...state, authenticated: false, user: null }
        case 'STOP_LOADING':
            return { ...state, loading: false }
        default:
            throw new Error(`Unknow action type: ${type}`)
    }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, defaultDispatch] = useReducer(reducer, {
        user: null,
        authenticated: false,
        loading: true,
        provider: null
    })

    const dispatch = (type: string, payload?: any) => defaultDispatch({ type, payload })

    useEffect(() => {
        async function loadUser() {
            try {
                const res = await axios.get('/auth/me')
                switch (res.data.provider) {
                    case 'local':
                        dispatch('LOCAL_LOGIN', res.data)
                        break;
                    case 'facebook':
                        dispatch('FACEBOOK_AUTH', res.data)
                        break;
                    case 'google':
                        dispatch('GOOGLE_AUTH', res.data)
                        break;
                    default:
                        break;
                }
            } catch (err) {
                console.error(err)
            } finally {
                dispatch('STOP_LOADING')
            }
        }
        loadUser()
    }, [])

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>{children}</StateContext.Provider>
        </DispatchContext.Provider>
    )
}
  
  export const useAuthState = () => useContext(StateContext)
  export const useAuthDispatch = () => useContext(DispatchContext)
  