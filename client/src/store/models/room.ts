import { createModel } from '@rematch/core'
import axios, { AxiosError } from 'axios'

import { RootModel } from '.'
import { Room } from '../../utils/types'


interface RoomState {
    rooms: Room[] | [],
    activeRoom: Room | null
}

const initialState: RoomState = {
    rooms: [],
    activeRoom: null
}

export const room = createModel<RootModel>()({
    name: 'room',
    state: initialState,
    reducers: {
        SET_ROOMS: (state, payload) => {
            return {
                ...state,
                rooms: payload,
            }
        },
        SET_ACTIVE_ROOM: (state, payload) => {
            return {
                ...state,
                activeRoom: payload,
            }
        }
    },
    effects: (dispatch) => ({
        async setRooms(rooms?: Room[]) {
            try {
                if(!rooms) {
                    const res = await axios.get('/room/my/rooms')
                    dispatch.room.SET_ROOMS(res.data)
                    return
                }
                dispatch.room.SET_ROOMS(rooms)
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
        async setActiveRoom(room: Room | null) {
            try {
                dispatch.room.SET_ACTIVE_ROOM(room)
            } catch (err: any) {
                console.log(err)
                return err
            }
        }
    })
})