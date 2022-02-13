import { createSlice } from '@reduxjs/toolkit'

const INITIAL_STATE = {
    currentUser: undefined
}

export const usersSlice = createSlice({
    name: 'users',
    initialState: {...INITIAL_STATE},
    reducers: {
        loadCurrentUser: (state, action) => {
            state.currentUser = action.payload
        }       
    }
})

export const {    
    loadCurrentUser
} = usersSlice.actions

//Selectors
export const currentUserSelector = (state) => state.users.currentUser

export default usersSlice.reducer
