import Web3 from 'web3/dist/web3.min'
import UsersContract from '../abis/Users.json'
import { loadWeb3, setAccount, loadUsersContract } from '../store/slices/ethSlice'

export const detectETHWallet = (setIsWallet, setShowAlert, dispatch) => {    
    if(window.ethereum) {
        setIsWallet(true)
        loadDappData(setShowAlert, dispatch)
    } else {
        setIsWallet(false)
        setShowAlert({show: true, link: 'https://metamask.io/download', linkText: 'MetaMask', text: 'Por favor descarga un wallet para ETH. Recomendamos '})
    }
}  

const loadDappData = async (setShowAlert, dispatch) => {
    const web3 = getWeb3(dispatch)
    const account = await getAccount(web3, dispatch)
    const users = await loadContract(web3, UsersContract, loadUsersContract, dispatch)

    if(!users) {
        setShowAlert({show: true, link: '', linkText: '', text: 'Los contratos no están disponibles. Favor de seleccionar otra red.'})
    } else if(account) {
        console.log('Estamos conectados')
    } else {
        console.log('Estamos desconectados')
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
        dispatch(setAccount(accounts[0]))
        return accounts[0]
    } else {
        return undefined
    }
}

const loadContract = async (web3, contractDef, loadAction, dispatch) => {
    const networkId = await web3.eth.net.getId()
    const networks = contractDef.networks

    if(networks[networkId] === undefined) {        
        return undefined
    } else {
        const address = networks[networkId].address
        const abi = contractDef.abi
        const contract = new web3.eth.Contract(abi, address)
        dispatch(loadAction(contract))
        return contract
    }
}
