import { createSlice } from '@reduxjs/toolkit'

const INITIAL_STATE = {
    web3: undefined,
    account: undefined,
    usersContract: undefined,
}

export const ethSlice = createSlice({
    name: 'eth',
    initialState: {...INITIAL_STATE},
    reducers: {
        loadWeb3: (state, action) => {
            state.web3 = action.payload
        },

        setAccount: (state, action) => {
            state.account = action.payload
        },

        loadUsersContract: (state, action) => {
            state.usersContract = action.payload
        }
    }
})

export const {
    loadWeb3,
    setAccount,
    loadUsersContract
} = ethSlice.actions

//Selectors
export const accountSelector = (state) => state.eth.account

export default ethSlice.reducer
