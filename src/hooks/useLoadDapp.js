import { useSelector } from "react-redux"
import { accountSelector, usersContractSelector, dappLoadedSelector, web3Selector } from "../store/slices/ethSlice"

function useDapp() {
    const account = useSelector(accountSelector)
    const usersContract = useSelector(usersContractSelector)
    const dappLoaded = useSelector(dappLoadedSelector)
    const web3 =  useSelector(web3Selector)

    return {dappLoaded, account, usersContract, web3}
}

export default useDapp