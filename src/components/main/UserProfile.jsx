import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Card, Button, Tooltip, OverlayTrigger, Form, Spinner } from 'react-bootstrap'
import { PROFILE_ACTIONS, ipfsData } from '../../config'
import { displayAlert, getUserNumbers } from '../helpers'
import { updateUser } from '../../services/usersService'
import useLoadDapp from '../../hooks/useLoadDapp'
import useStatus from '../../hooks/useStatus'
import { Buffer } from 'buffer'
import { setIsProcessingGlobal, setComponentAlertGlobal } from '../../store/slices/statusSlice'

import '../../styles/Profile.css'

function UserProfile({userInfo, editable, action}) {
  const {name, address, posts, followings, followers, cost, profilePic} = userInfo
  
  useEffect(() => {
    document.getElementById('profileImg').style.backgroundImage = `url("${ipfsData.protocol}://${ipfsData.host}/ipfs/${profilePic}")`    
  }, [profilePic])

  const [tooltipText, setToolTipText] = useState('Copiar al Portapapeles')
  const [hasChange, setHasChange] = useState(false)
  const [imgBuffer, setImgBuffer] = useState(undefined)
  const {web3, usersContract} = useLoadDapp()
  
  const dispatch = useDispatch()
  const {isProcessing, componentAlert} = useStatus()

  const formatAddress = () => {
    return `${address.substring(0,5)}...${address.substring(address.length - 4, address.length)}`
  }

  const copyAddress = () => {
    const elem = document.createElement('textarea');
    elem.value = address;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand('copy');
    document.body.removeChild(elem);
    setToolTipText('Copiado!')
  }
  
  const getMainButton = () => {
    if(action === PROFILE_ACTIONS.UPDATE){
      return (<Button variant="primary" onClick={handleUpdate} disabled={!hasChange}>Guardar</Button>)
    } else {
      return(<></>)
    }
  }
  
  const handleUpdate = () => {    
    dispatch(setComponentAlertGlobal({...componentAlert, show: false}))
    
    const updatedName = document.getElementById('profileName').value
    const updatedCost = document.getElementById('profileCost').value

    if(updatedName.trim() === '' || updatedCost.trim() === '') {      
      dispatch(setComponentAlertGlobal({show: true, type: 'danger', text: 'Campos obligatorios.', link: '', linkText: ''}))
    } else {
      dispatch(setIsProcessingGlobal(true))      
      setHasChange(false)
      updateUser(web3, address, usersContract, {name: updatedName, profilePic, cost: parseFloat(updatedCost), imgBuffer}, setImgBuffer, dispatch)      
    }
  }

  const loadProfilePic = () => {
    const profileFile = document.getElementById('profileFile').files[0]
    readProfilePicAsURL(profileFile)
    readProfilePicAsBuffer(profileFile)
    setHasChange(true)
  }    

  const readProfilePicAsURL = (profileFile) => {
    const reader = new FileReader()

    reader.onloadend = () => {
        document.getElementById('profileImg').style.backgroundImage = `url(${reader.result})`            
    }

    if(profileFile) {
        reader.readAsDataURL(profileFile)            
    }
  }

  const readProfilePicAsBuffer = (profileFile) => {
    const reader = new FileReader()

    reader.onloadend = () => {            
        const buffer = Buffer.from(reader.result)
        setImgBuffer(buffer)            
    }

    if(profileFile) {
        reader.readAsArrayBuffer(profileFile)
    }
  }

  return (
    <Card className='main-element' style={{ width: '18rem' }}>   
        <div className='bg-image bg-image-cover profile-card-background d-flex flex-column justify-content-center align-items-center'>
          <div id='profileImg' className='bg-image bg-image-cover profile-img profile-card-img d-flex flex-column justify-content-center align-items-center' onClick={() => {document.getElementById('profileFile').click()}}/>
        </div>  
        <Form.Control required id="profileFile" type="file" accept="image/*" hidden onChange={loadProfilePic}/>
        <Card.Body style={{marginTop: '50px'}}>
        <Card.Title>
          <Form.Group controlId="profileName">
            <Form.Control className='profile-input profile-input-title' type="text" required defaultValue={name} disabled={!editable} onChange={() => {setHasChange(true)}}/>
          </Form.Group>
        </Card.Title>
        <OverlayTrigger placement='bottom' overlay={<Tooltip id="tooltip-copy">{tooltipText}</Tooltip>} onExited={() => {setToolTipText('Copiar al Portapapeles')}}>
          <Card.Subtitle className="mb-2 text-muted d-flex flex-row justify-content-center align-items-center" style={{fontSize: '0.8rem', cursor: 'pointer'}} onClick= {copyAddress}>
            <div style={{marginRight: '8px'}}>{formatAddress()}</div>
            <div><i className="bi bi-clipboard"></i></div>
          </Card.Subtitle>
        </OverlayTrigger>
        {getUserNumbers(posts, followers, followings)}
        <div className='d-flex flex-column justify-content-center align-items-center' style={{fontSize: '0.9rem', margin: '24px 0px 24px 0px'}}>
          <Form.Group controlId="profileCost">
            <Form.Control className='profile-input profile-input-title' type="number" step={'any'} required defaultValue={cost} disabled={!editable} onChange={() => {setHasChange(true)}}/>
          </Form.Group>
          <div>Membresía (ETH)</div>
        </div>        
        {componentAlert.show ? displayAlert(componentAlert.type, componentAlert.text, componentAlert.link, componentAlert.linkText) : <></>}
        {isProcessing ? <Spinner animation='grow' /> : getMainButton()}
        </Card.Body>
    </Card>
  )
}

export default UserProfile
