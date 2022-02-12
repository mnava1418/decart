import { setCurrentPage } from "../store/slices/statusSlice"
import { APP_PAGES } from "../config"

export const getCurrentUser = async (account, usersContract, dispatch) => {    
    const currentUser = await usersContract.methods.users(account).call()
    
    if(currentUser.valid) {
        dispatch(setCurrentPage(APP_PAGES.MAIN))
    } else {
        dispatch(setCurrentPage(APP_PAGES.REGISTER))
    }
}