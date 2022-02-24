import { useSelector } from "react-redux"
import { isProcessingSelector, setIsProcessing } from "../store/slices/statusSlice"

function useStatus() {
    const isProcessing = useSelector(isProcessingSelector)

    return {isProcessing, setIsProcessing}
}

export default useStatus