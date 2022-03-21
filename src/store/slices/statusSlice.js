import { createSlice } from '@reduxjs/toolkit'
import { APP_PAGES } from '../../config'

const INITIAL_STATE = {
    currentPage: APP_PAGES.LANDING,
    isConnected: false,
    isProcessing: false,
    componentAlert: {
        show: false, 
        type:'', 
        text: '', 
        link: '', 
        linkText: ''
    }    
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

        setIsProcessingGlobal: (state, action) => {
            state.isProcessing = action.payload
        },

        setComponentAlertGlobal: (state, action) => {
            state.componentAlert = action.payload
        }
    }
})

export const {
    setCurrentPage,
    setIsConnected,
    setIsProcessingGlobal,
    setComponentAlertGlobal
} = statusSlice.actions

//Selectors
export const currentPageSelector = (state) => state.status.currentPage

export const isConnectedSelector = (state) => state.status.isConnected

export const isProcessingSelector = (state) => state.status.isProcessing

export const componentAlertSelector = (state) => state.status.componentAlert

export default statusSlice.reducer
