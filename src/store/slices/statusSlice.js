import { createSlice } from '@reduxjs/toolkit'
import { APP_PAGES } from '../../config'

const INITIAL_STATE = {
    currentPage: APP_PAGES.LOADING,
    isConnected: false,
    isProcessing: false,
    isAlert: false,
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
        },

        setIsAlert: (state, action) => {
            state.isAlert = action.payload
        }
    }
})

export const {
    setCurrentPage,
    setIsConnected,
    setIsProcessing,
    setIsAlert
} = statusSlice.actions

//Selectors
export const currentPageSelector = (state) => state.status.currentPage

export const isConnectedSelector = (state) => state.status.isConnected

export const isProcessingSelector = (state) => state.status.isProcessing

export const isAlertSelector = (state) => state.status.isAlert

export default statusSlice.reducer
