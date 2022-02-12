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

        loadDappInfo: (state, action) => {
            state.account = action.payload.account
            state.usersContract = action.payload.usersContract
        }        
    }
})

export const {
    loadWeb3,   
    loadDappInfo 
} = ethSlice.actions

//Selectors
export const accountSelector = (state) => state.eth.account

export const usersContractSelector = (state) => state.eth.usersContract

export const dappLoadedSelector = (state) => {
    const {account, usersContract} = state.eth
    return (account !== undefined && usersContract !== undefined)
}


export default ethSlice.reducer
