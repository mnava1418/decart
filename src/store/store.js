import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import ethReducer from './slices/ethSlice'
import statusReducer from './slices/statusSlice'
import usersReducer from './slices/usersSlice'

export default configureStore({
    reducer: {
        eth: ethReducer,
        status: statusReducer,
        users: usersReducer
    },
    middleware: getDefaultMiddleware({
        serializableCheck: false
    })
})
