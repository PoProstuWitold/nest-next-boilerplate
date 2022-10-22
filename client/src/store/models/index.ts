import { Models } from '@rematch/core'

import { user } from './user'
import { room } from './room'
import { conversation } from './conversation'

export interface RootModel extends Models<RootModel> {
    user: typeof user,
    room: typeof room,
    conversation: typeof conversation
}

export const models: RootModel = { user, room, conversation }