import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import { models, RootModel } from './models'
import loadingPlugin, { ExtraModelsFromLoading } from '@rematch/loading'
import persistPlugin from '@rematch/persist'
import storage from 'redux-persist/lib/storage'

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