import { configureStore } from '@reduxjs/toolkit'
import ethReducer from './slices/ethSlice'

export default configureStore({
    reducer: {
        eth: ethReducer
    },
    devTools: process.env.NODE_ENV !== 'production'
})
