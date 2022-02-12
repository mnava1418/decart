import { useSelector } from "react-redux"
import { accountSelector, usersContractSelector, dappLoadedSelector } from "../store/slices/ethSlice"

function useDapp() {
    const account = useSelector(accountSelector)
    const usersContract = useSelector(usersContractSelector)
    const dappLoaded = useSelector(dappLoadedSelector)

    return {dappLoaded, account, usersContract}
}

export default useDapp