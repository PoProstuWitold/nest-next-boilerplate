import { createModel } from '@rematch/core'
import axios, { AxiosError } from 'axios'

import { RootModel } from '.'
import { User } from '../../utils/types'

interface UserState {
    authenticated: boolean,
    user: User | null
}

const initialState: UserState = {
    authenticated: false,
    user: null
}

export const user = createModel<RootModel>()({
    name: 'user',
    state: initialState,
    reducers: {
        SET_USER: (state, payload) => {
            return {
                ...state,
                authenticated: true,
                user: payload,
            }
        },
        LOGOUT: (state) => {
            return {
                ...state,
                authenticated: false,
                user: null,
            }
        }
    },
    effects: (dispatch) => ({
        async localLoginAsync({ email, password }) {
            try {
                const { data } = await axios.post('/auth/local/login', {
                    email,
                    password
                })
                dispatch.user.SET_USER(data.user)
                return data
            } catch (err: any) {
                console.log(err)
                let axiosError: AxiosError;
                if(err instanceof AxiosError) {
                    axiosError = err.response?.data
                    return axiosError
                }
                return err
            }
        },
        async localRegisterAsync({ email, password, firstName, lastName, displayName}) {
            try {
                const { data } = await axios.post('/auth/local/register', {
                    email,
                    password,
                    firstName,
                    lastName,
                    displayName
                })
                dispatch.user.SET_USER(data.user)
                return data
            } catch (err: any) {
                console.log(err)
                let axiosError: AxiosError;
                if(err instanceof AxiosError) {
                    axiosError = err.response?.data
                    return axiosError
                }
                return err
            }
        },
        async socialLoginAsync() {
            let { data } = await axios.get('/auth/me')
            console.log(data)
            dispatch.user.SET_USER(data.user)
        },
        async logoutAsync() {
            try {
                await dispatch.room.setRooms([])
                await dispatch.room.setActiveRoom(null)
                await dispatch.conversation.setConversations([])
                await dispatch.conversation.setActiveConversation(null)
                
                await axios.delete('/auth/logout')
                dispatch.user.LOGOUT()
            } catch (err) {
                dispatch.user.LOGOUT()
            }
        },
        async getUserProfileAsync() {
            try {
                let { data } = await axios.get('/auth/me')
                console.log(data)
                dispatch.user.SET_USER(data.user)
            } catch (err) {
                dispatch.user.LOGOUT()
            }
        }
    })
})