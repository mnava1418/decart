import { setCurrentPage } from "../store/slices/statusSlice"
import { APP_PAGES, REGISTRATION_COST, CONTACT_EMAIL } from "../config"
import { getETHPrice } from './ethService'
import { loadCurrentUser } from "../store/slices/usersSlice"

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
    usersContract.methods.createUser(userInfo.name, userInfo.email, userInfo.profilePic, web3.utils.toWei(`${userInfo.cost}`, 'ether'))
    .send({from: account, value: web3.utils.toWei(`${registrationCost}`, 'ether')})
    .on('transactionHash', (hash) => {
        setShowAlert({show: true, type: 'warning', text: 'La transacción está siendo procesada.'})
    })
    .on('error', (err) => {
        console.error(err)

        if(err.code !== 4001) {
            setShowAlert({show: true, type: 'danger', text: 'Error: Favor de contactarnos a ', link: `mailto:${CONTACT_EMAIL}`, linkText: `${CONTACT_EMAIL}`})
        }
        
        setIsProcessing(false)
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
