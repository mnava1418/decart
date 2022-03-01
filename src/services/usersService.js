import { setCurrentPage, setComponentAlertGlobal, setIsProcessingGlobal } from "../store/slices/statusSlice"
import { APP_PAGES, REGISTRATION_COST, CONTACT_EMAIL, ipfsData } from "../config"
import { getETHPrice } from './ethService'
import { loadCurrentUser, setAllUsers } from "../store/slices/usersSlice"
import { create } from 'ipfs-http-client'

export const getCurrentUser = async (account, usersContract, dispatch) => {    
    const currentUser = await usersContract.methods.users(account).call()
    
    if(currentUser.valid) {
        dispatch(setCurrentPage(APP_PAGES.MAIN))
        dispatch(loadCurrentUser(currentUser))

    } else {
        dispatch(setCurrentPage(APP_PAGES.REGISTER))
        dispatch(loadCurrentUser(undefined))
    }
}

export const createUser = async (web3, account, usersContract, userInfo, registrationCost, setShowAlert, setIsProcessing) => {    
    const profilePic = await uploadImg(userInfo.imgBuffer)

    //const profilePic = 'QmNmBvj2e7vjzgppVPfAiSmsH1KwaiUeNU2Hc3nX1w4Pgd'
 
    usersContract.methods.createUser(userInfo.name, userInfo.email, profilePic, web3.utils.toWei(`${userInfo.cost}`, 'ether'))
    .send({from: account, value: web3.utils.toWei(`${registrationCost}`, 'ether')})
    .on('transactionHash', (hash) => {
        processOk(setShowAlert)
    })
    .on('error', (err) => {
       processError(err, setShowAlert, setIsProcessing)
    });
}

export const updateUser = async(web3, account, usersContract, userInfo, setImgBuffer, dispatch) => {
    if(userInfo.imgBuffer !== undefined) {
        userInfo.profilePic = await uploadImg(userInfo.imgBuffer)
        setImgBuffer(undefined)
    }

    usersContract.methods.updateUser(userInfo.name, userInfo.profilePic, web3.utils.toWei(`${userInfo.cost}`, 'ether'))
    .send({from: account})
    .on('transactionHash', (hash) => {        
        dispatch(setComponentAlertGlobal({show: true, type: 'warning', text: 'La transacción está siendo procesada.', link: '', linkText: ''}))        
    })
    .on('error', (err) => {
        console.error(err)

        if(err.code !== 4001) {            
            dispatch(setComponentAlertGlobal({show: true, type: 'danger', text: 'Error: Favor de contactarnos a ', link: `mailto:${CONTACT_EMAIL}`, linkText: `${CONTACT_EMAIL}`}))
        }

        dispatch(setIsProcessingGlobal(false))
    });
}

export const getRegistrationCost = async() => {
    const ethPrice = await getETHPrice()
    
    if(ethPrice > 0.0) {
        return (REGISTRATION_COST / ethPrice).toFixed(8)
    } else {
        return 0.0
    }
}

const processOk = (setShowAlert) => {
    setShowAlert({show: true, type: 'warning', text: 'La transacción está siendo procesada.'})
}

const processError = (err, setShowAlert, setIsProcessing) => {
    console.error(err)

    if(err.code !== 4001) {
        setShowAlert({show: true, type: 'danger', text: 'Error: Favor de contactarnos a ', link: `mailto:${CONTACT_EMAIL}`, linkText: `${CONTACT_EMAIL}`})
    }
    
    setIsProcessing(false)
}

const uploadImg = async (data) => {    
    const ipfs = create(ipfsData)
    const result = await ipfs.add(data)

    return result.path
}

export const getAllUsers = async(usersContract, dispatch) => {
    const users = []
    const createUserEvents = await usersContract.getPastEvents('CreateUser', {fromBlock: 0, toBlock: 'latest'})
    const addressCollection = createUserEvents.map(event => event.returnValues.userAddress)

    for (const address of addressCollection) {
        const user = await usersContract.methods.users(address).call()        
        users.push(user)        
    }    
    
    dispatch(setAllUsers(users))
}
