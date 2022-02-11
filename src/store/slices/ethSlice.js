import { createSlice } from '@reduxjs/toolkit'

const INITIAL_STATE = {
    web3: null,
    account: null,
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
        }
    }
})

export const {
    loadWeb3,
    setAccount
} = ethSlice.actions

//Selectors
export const accountSelector = (state) => state.eth.account

export default ethSlice.reducer
