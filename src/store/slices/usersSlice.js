import { createSlice } from '@reduxjs/toolkit'

const INITIAL_STATE = {
    isRegisterUser: false, //flag for the first time a user is created. No used for other purposes
    currentUser: undefined,
    allUsers: [],
}

export const usersSlice = createSlice({
    name: 'users',
    initialState: {...INITIAL_STATE},
    reducers: {
        loadCurrentUser: (state, action) => {
            state.currentUser = action.payload
        },
        
        setIsRegisterUser: (state, action) => {
            state.isRegisterUser = action.payload
        },

        setAllUsers: (state, action) => {
            state.allUsers = action.payload
        }
    }
})

export const {    
    loadCurrentUser,
    setIsRegisterUser,
    setAllUsers
} = usersSlice.actions

//Selectors
export const currentUserSelector = (state) => state.users.currentUser

export const isRegisterUserSelector = (state) => state.users.isRegisterUser

export const allUsersSelector = (state) => state.users.allUsers

export default usersSlice.reducer
