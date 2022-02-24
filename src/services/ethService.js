import Web3 from 'web3/dist/web3.min'
import UsersContract from '../abis/Users.json'
import { loadWeb3, loadDappInfo } from '../store/slices/ethSlice'
import { setIsConnected, setIsProcessing } from '../store/slices/statusSlice'
import { setIsRegisterUser } from '../store/slices/usersSlice'
import { get } from './networkService'
import { COINBASE_URL } from '../config'
import { getCurrentUser } from './usersService'

const DECIMALS = (10**18)

export const detectETHWallet = (setShowAlert, dispatch) => {    
    if(window.ethereum && window.ethereum.isMetaMask) {        
        loadDappData(setShowAlert, dispatch)
    } else {        
        dispatch(setIsConnected(false))
        setShowAlert({show: true, link: 'https://metamask.io/download', linkText: 'MetaMask', text: 'Por favor descarga '})
    }
}  

const loadDappData = async (setShowAlert, dispatch) => {
    const web3 = getWeb3(dispatch)
    const account = await getAccount(web3, dispatch)
    const users = await loadContract(web3, UsersContract)

    if(!users) {
        setShowAlert({show: true, link: '', linkText: '', text: 'Los contratos no están disponibles. Favor de seleccionar otra red.'})
    } 
    
    if(users && account) {
        dispatch(setIsConnected(true))
        dispatch(loadDappInfo({account, usersContract: users}))
        subscribeToEvents(users, account, dispatch)
    } else {
        dispatch(setIsConnected(false))
    }
}

const getWeb3 = (dispatch) => {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545')
    dispatch(loadWeb3(web3))
    return web3
}

const getAccount = async (web3, dispatch) => {    
    const accounts = await web3.eth.getAccounts()
    
    if(accounts.length > 0) {        
        return accounts[0]
    } else {
        return undefined
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
    const result = await get(COINBASE_URL, '/v2/prices/ETH-USD/spot', {})
    let ethPrice = 0.0

    if(result.status === 200) {
        ethPrice =  parseFloat(result.data.data.amount)
    }
    
    return ethPrice
}

const subscribeToEvents = (usersContract, account, dispatch) => {
    usersContract.events.CreateUser()
    .on('data', async (event) => {        
        if(event.returnValues.userAddress === account) {
            dispatch(setIsRegisterUser(true))
        }
    })

    usersContract.events.UpdateUser()
    .on('data', async (event) => {
        if(event.returnValues.userAddress === account) {                  
            getCurrentUser(account, usersContract, dispatch)      
            dispatch(setIsProcessing(false))      
        }
    })
}


export const fromWei = (amount) => {
    return (amount/DECIMALS)
}