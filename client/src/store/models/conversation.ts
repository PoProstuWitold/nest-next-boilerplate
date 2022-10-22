import { createModel } from '@rematch/core'
import axios, { AxiosError } from 'axios'

import { RootModel } from '.'


interface ConversationState {
    conversations: any[] | [],
    activeConversation: any | null
}

const initialState: ConversationState = {
    conversations: [],
    activeConversation: null
}

export const conversation = createModel<RootModel>()({
    name: 'conversation',
    state: initialState,
    reducers: {
        SET_CONVERSATIONS: (state, payload) => {
            return {
                ...state,
                conversations: payload,
            }
        },
        SET_ACTIVE_CONVERSATION: (state, payload) => {
            return {
                ...state,
                activeConversation: payload,
            }
        }
    },
    effects: (dispatch) => ({
        async setConversations(conversations?: any[]) {
            try {
                if(!conversations) {
                    const res = await axios.get('/conversation/my/conversations')
                    dispatch.conversation.SET_CONVERSATIONS(res.data)
                    return
                }
                dispatch.conversation.SET_CONVERSATIONS(conversations)
            } catch (err: any) {
                console.error(err)
                let axiosError: AxiosError;
                if(err instanceof AxiosError) {
                    axiosError = err.response?.data
                    return axiosError
                }
                return err
            }
        },
        async setActiveConversation(conversation: any | null) {
            try {
                dispatch.conversation.SET_ACTIVE_CONVERSATION(conversation)
            } catch (err: any) {
                console.error(err)
                return err
            }
        }
    })
})