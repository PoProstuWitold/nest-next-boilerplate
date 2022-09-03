import { Models } from '@rematch/core'

import { user } from './user'
import { room } from './room'

export interface RootModel extends Models<RootModel> {
    user: typeof user,
    room: typeof room
}

export const models: RootModel = { user, room }