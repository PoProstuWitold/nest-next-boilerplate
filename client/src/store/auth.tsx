import { createContext, useEffect  } from 'react'
import { useDispatch } from 'react-redux'
import { Dispatch } from './store'

const DispatchContext = createContext<any>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const dispatch = useDispatch<Dispatch>()
    useEffect(() => {
        async function loadUser() {
            try {
                dispatch.user.getUserProfileAsync()
            } catch (err) {
                console.error(err)
            }
        }
        loadUser()
    }, [])

    return (
        <DispatchContext.Provider value={dispatch}>
            {children}
        </DispatchContext.Provider>
    )
}
  