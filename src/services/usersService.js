import { setCurrentPage } from "../store/slices/statusSlice"
import { APP_PAGES, REGISTRATION_COST, CONTACT_EMAIL, ipfsData } from "../config"
import { getETHPrice } from './ethService'
import { loadCurrentUser } from "../store/slices/usersSlice"
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

export const updateUser = (web3, account, usersContract, userInfo, setIsProcessing, setShowAlert, setComponentAlert, dispatch) => {
    usersContract.methods.updateUser(userInfo.name, userInfo.profilePic, web3.utils.toWei(`${userInfo.cost}`, 'ether'))
    .send({from: account})
    .on('transactionHash', (hash) => {
        dispatch(setShowAlert(true))
        setComponentAlert({type: 'warning', text: 'La transacción está siendo procesada.'})
    })
    .on('error', (err) => {
        console.error(err)

        dispatch(setShowAlert(true))

        if(err.code !== 4001) {
            setComponentAlert({type: 'danger', text: 'Error: Favor de contactarnos a ', link: `mailto:${CONTACT_EMAIL}`, linkText: `${CONTACT_EMAIL}`})
        }

        dispatch(setIsProcessing(false))
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