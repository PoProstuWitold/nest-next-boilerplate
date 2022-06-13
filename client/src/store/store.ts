import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import loadingPlugin, { ExtraModelsFromLoading } from '@rematch/loading'
import persistPlugin from '@rematch/persist'
import storage from 'redux-persist/lib/storage'

import { models, RootModel } from './models'

const persistConfig = {
    key: 'root',
    storage,
}

type FullModel = ExtraModelsFromLoading<RootModel, { type: 'full' }>

export const store = init<RootModel, FullModel>({
    models,
    plugins: [loadingPlugin({ type: 'full' }), persistPlugin(persistConfig)]
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel, FullModel>