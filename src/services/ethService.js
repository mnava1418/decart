import Web3 from 'web3/dist/web3.min'
import UsersContract from '../abis/Users.json'
import { loadWeb3, loadDappInfo } from '../store/slices/ethSlice'
import { setIsConnected } from '../store/slices/statusSlice'

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
