import { create } from 'ipfs-http-client'
import { setCurrentPage, setIsConnected, setIsProcessingGlobal, setComponentAlertGlobal } from "../store/slices/statusSlice"
import { APP_PAGES, SIGN_MESSAGE, BASE_URLS, ipfsData } from "../config"
import { loadCurrentUser, resetUserState } from "../store/slices/usersSlice"
import { post, get } from './networkService'
import { PROFILE_IMG_INPUT_ID, PROFILE_COVER_INPUT_ID } from '../components/main/UserProfile'
import { JWT_KEY, ADDRESS_KEY } from '../config'

export const updateUser = async(userInfo, imgBuffer, componentAlert, currentUser, dispatch) => {
    const baseURL = BASE_URLS[process.env.NODE_ENV]
    const token = getCurrentToken()
    userInfo.isDefault = currentUser.isDefault

    if(imgBuffer[PROFILE_IMG_INPUT_ID] !== undefined) {
        userInfo.profilePic = await uploadImg(imgBuffer[PROFILE_IMG_INPUT_ID])
    }

    if(imgBuffer[PROFILE_COVER_INPUT_ID] !== undefined) {
        userInfo.coverPic = await uploadImg(imgBuffer[PROFILE_COVER_INPUT_ID])
    }    
    
    post(baseURL, '/user', userInfo, token)
    .then((response) => {
        dispatch(setIsProcessingGlobal(false))

        if(response.status === 200) {
            dispatch(setComponentAlertGlobal({...componentAlert, show: true, type: 'success', text: 'Changes saved.'}))
            dispatch(loadCurrentUser({...currentUser, isDefault: 0}))
        } else {
            dispatch(setComponentAlertGlobal({...componentAlert, show: true, type: 'danger', text: response.data.message}))
        }
    })
}

const uploadImg = async (data) => {    
    const ipfs = create(ipfsData)
    const result = await ipfs.add(data)

    return result.path
}

export const loadUserInfo = async(web3, account, setAppAlert, dispatch, forceLogin = true) => {
    const token = getCurrentToken()
    setAppAlert({show: false})
    
    if(token) {
        const userInfo = await getUserInfo(token)

        if(userInfo && userInfo.hasOwnProperty('errorMessage')) {
            localStorage.clear()
            setAppAlert({show: true, text: userInfo.errorMessage, link: '', linkText: ''})
        } else if(userInfo && userInfo.address.toUpperCase() === account.toUpperCase()) {
            dispatch(setIsConnected(true))
            dispatch(setCurrentPage(APP_PAGES.MAIN))
            dispatch(loadCurrentUser(userInfo))
            localStorage.setItem(ADDRESS_KEY, userInfo.address)
        } else {
            localStorage.clear()
            loadUserInfo(web3, account, setAppAlert, dispatch)
        }
    } else if(forceLogin) {
        login(account, web3, setAppAlert, dispatch)
    }
}

const getUserInfo = async (token) => {
    const baseURL = BASE_URLS[process.env.NODE_ENV]
    const userInfo = await get(baseURL, '/user', token)
    .then((response) => {
        switch(response.status) {
            case 200:
                return response.data.userInfo
            case 401:                
                return undefined
            default:                
                return {errorMessage: `${response.data.message}`}
        }
    })

    return userInfo
}

const login = async (account, web3, setAppAlert, dispatch) => {
    const validationResult = await validateUserAccount(web3, account)
    const {signature, message, isValid} = validationResult
    const info = {account, signature, message}
    
    if(isValid) {
        const baseURL = BASE_URLS[process.env.NODE_ENV]
        post(baseURL, '/auth', info)
        .then((response) => {
            if(response.status === 200) {
                localStorage.setItem(JWT_KEY, response.data.token)
                loadUserInfo(web3, info.account, setAppAlert, dispatch)
            } else {
                setAppAlert({show: true, text: 'Unable to authenticate user. Please try later.', link: '', linkText: ''})
            }
        })
    }    
}

const getCurrentToken = () => {
    const token = localStorage.getItem(JWT_KEY)

    if(token === null || token === undefined) {
        return undefined
    } else {
        return token
    }
}

const validateUserAccount = async(web3, account) => {  
    const result = await web3.eth.personal.sign(SIGN_MESSAGE, account)
    .then((signature) => {   
        return {isValid: true, signature, message: SIGN_MESSAGE}
    })
    .catch((err) => {
        console.error(err)
        return {isValid: false}
    })

    return result
}

export const logOut = (dispatch) => {
    dispatch(setIsConnected(false))
    dispatch(setCurrentPage(APP_PAGES.LANDING))
    dispatch(resetUserState())
    localStorage.clear()
}