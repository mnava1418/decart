import { useState } from 'react'

function useUserProfile() {
    const [tooltipText, setToolTipText] = useState('Copiar al Portapapeles')
    const [hasChange, setHasChange] = useState(false)
    const [imgBuffer, setImgBuffer] = useState({})
    const [selectedImg, setSelectedImg] = useState('')
    const [validated, setValidated] = useState(false)

    return {tooltipText, setToolTipText, hasChange, setHasChange, imgBuffer, setImgBuffer, selectedImg, setSelectedImg, validated, setValidated}
}

export default useUserProfile