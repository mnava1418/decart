import { createSlice } from '@reduxjs/toolkit'

const INITIAL_STATE = {
    isRegisterUser: false, //flag for the first time a user is created. No used for other purposes
    currentUser: undefined,
    allUsers: [],
    selectedUser: undefined
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
        },

        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload
        },

        resetUserState: (state) => {
            state.isRegisterUser = INITIAL_STATE.isRegisterUser
            state.currentUser = INITIAL_STATE.currentUser
            state.allUsers = INITIAL_STATE.allUsers
            state.selectedUser = INITIAL_STATE.selectedUser
        }
    }
})

export const {    
    loadCurrentUser,
    setIsRegisterUser,
    setAllUsers,
    setSelectedUser,
    resetUserState
} = usersSlice.actions

//Selectors
export const currentUserSelector = (state) => state.users.currentUser

export const isRegisterUserSelector = (state) => state.users.isRegisterUser

export const allUsersSelector = (state) => state.users.allUsers

export const selectedUserSelector = (state) => state.users.selectedUser

export default usersSlice.reducer
