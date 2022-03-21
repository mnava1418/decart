import { useState } from 'react'

function useAlert() {
  const [appAlert, setAppAlert] = useState({show: false, text: '', link: '', linkText: ''})

  return {appAlert, setAppAlert}
}

export default useAlert
