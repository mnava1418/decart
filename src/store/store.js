import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import ethReducer from './slices/ethSlice'
import statusReducer from './slices/statusSlice'

export default configureStore({
    reducer: {
        eth: ethReducer,
        status: statusReducer
    },
    middleware: getDefaultMiddleware({
        serializableCheck: false
    })
})
