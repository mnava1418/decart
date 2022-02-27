import { useSelector } from "react-redux"
import { isProcessingSelector, componentAlertSelector } from "../store/slices/statusSlice"

function useStatus() {
    const isProcessing = useSelector(isProcessingSelector)
    const componentAlert = useSelector(componentAlertSelector)
    
    return {isProcessing, componentAlert}
}

export default useStatus