import { createSlice } from '@reduxjs/toolkit'
import { APP_PAGES } from '../../config'

const INITIAL_STATE = {
    currentPage: APP_PAGES.HOME
}

export const statusSlice = createSlice({
    name: 'status',
    initialState: {...INITIAL_STATE},
    reducers: {        
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload
        }
    }
})

export const {
    setCurrentPage
} = statusSlice.actions

//Selectors
export const currentPageSelector = (state) => state.status.currentPage

export default statusSlice.reducer
