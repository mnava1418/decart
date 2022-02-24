import { createSlice } from '@reduxjs/toolkit'
import { APP_PAGES } from '../../config'

const INITIAL_STATE = {
    currentPage: APP_PAGES.LOADING,
    isConnected: false,
    isProcessing: false,
}

export const statusSlice = createSlice({
    name: 'status',
    initialState: {...INITIAL_STATE},
    reducers: {        
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload
        },

        setIsConnected: (state, action) => {
            state.isConnected = action.payload
        },

        setIsProcessing: (state, action) => {
            state.isProcessing = action.payload
        }
    }
})

export const {
    setCurrentPage,
    setIsConnected,
    setIsProcessing
} = statusSlice.actions

//Selectors
export const currentPageSelector = (state) => state.status.currentPage

export const isConnectedSelector = (state) => state.status.isConnected

export const isProcessingSelector = (state) => state.status.isProcessing

export default statusSlice.reducer
