import { useSelector } from "react-redux"
import { isProcessingSelector, setIsProcessing, isAlertSelector, setIsAlert } from "../store/slices/statusSlice"

function useStatus() {
    const isProcessing = useSelector(isProcessingSelector)
    const isAlert = useSelector(isAlertSelector)

    return {isProcessing, setIsProcessing, isAlert, setIsAlert}
}

export default useStatus