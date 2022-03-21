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
        setWeb3: (state, action) => {
            state.web3 = action.payload
        },

        setAccount: (state, action) => {
            state.account = action.payload
        },

        setSmartContracts: (state, action) => {
            state.usersContract = action.payload.usersContract
        }
    }
})

export const {
    setWeb3,
    setAccount,
    setSmartContracts,
} = ethSlice.actions

//Selectors
export const accountSelector = (state) => state.eth.account

export const usersContractSelector = (state) => state.eth.usersContract

export const web3Selector = (state) => state.eth.web3

export const dappLoadedSelector = (state) => {
    const {account, usersContract} = state.eth
    return (account !== undefined && usersContract !== undefined)
}


export default ethSlice.reducer
