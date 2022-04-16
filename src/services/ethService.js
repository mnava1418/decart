import Web3 from 'web3/dist/web3.min'
import UsersContract from '../abis/Users.json'
import { setWeb3, setSmartContracts, setWalletDetected } from '../store/slices/ethSlice'
import { get } from './networkService'
import { COINBASE_URL } from '../config'
import { loadUserInfo } from './usersService'

const DECIMALS = (10**18)

const SMART_CONTRACTS = {
    usersContract: UsersContract
}

const isETHWalletDetected = () => {
    return(window.ethereum)
}  

export const loadDappData = async (dispatch, setAppAlert) => {
    if(isETHWalletDetected) {
        dispatch(setWalletDetected(true))
        const web3 = loadWeb3(dispatch)
        connectUser(web3, setAppAlert, dispatch)
        loadAllContracts(web3, setAppAlert, dispatch)
    } else {
        setAppAlert({show: true, text: 'No wallet detected. Download ', link: 'https://metamask.io/download/', linkText: 'Metamask'})
    }
}

const loadWeb3 = (dispatch) => {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545')
    dispatch(setWeb3(web3))
    return web3
}

const connectUser = async (web3, setAppAlert, dispatch) => {
    const userAccount = await getAccount(web3)
    
    if(userAccount) {
        loadUserInfo(web3, userAccount, setAppAlert, dispatch, false)
    }
}

const getAccount = async (web3) => {    
    const accounts = await web3.eth.getAccounts()
    
    if(accounts.length > 0) {        
        return accounts[0]
    } else {
        return undefined
    }
}

const loadAllContracts = async (web3, setAppAlert, dispatch) => {
    let contractsReady = true
    const contractsDef = {}
    
    for (const contractName in SMART_CONTRACTS) {
        const contract = await loadContract(web3, SMART_CONTRACTS[contractName])

        if(contract) {
            contractsDef[contractName] = contract
        } else {
            contractsReady = false
        }
    }    
    
    if(contractsReady) {
        dispatch(setSmartContracts(contractsDef))
    } else {
        setAppAlert({show: true, text: 'Smart Contracts not available. Please, use a different Network.', link: '', linkText: ''})
    }
}

const loadContract = async (web3, contractDef) => {
    const networkId = await web3.eth.net.getId()
    const networks = contractDef.networks

    if(networks[networkId] === undefined) {        
        return undefined
    } else {
        const address = networks[networkId].address
        const abi = contractDef.abi
        const contract = new web3.eth.Contract(abi, address)        
        return contract
    }
}

export const getETHPrice = async () => {
    const result = await get(COINBASE_URL, '/v2/prices/ETH-USD/spot')
    let ethPrice = 0.0

    if(result.status === 200) {
        ethPrice =  parseFloat(result.data.data.amount)
    }
    
    return ethPrice
}

export const fromWei = (amount) => {
    return (amount/DECIMALS)
}