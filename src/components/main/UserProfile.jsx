import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Card, Button, Tooltip, OverlayTrigger, Form, Spinner } from 'react-bootstrap'
import { PROFILE_ACTIONS, ipfsData } from '../../config'
import { displayAlert } from '../helpers'
import { updateUser } from '../../services/usersService'
import useLoadDapp from '../../hooks/useLoadDapp'
import useStatus from '../../hooks/useStatus'
import { Buffer } from 'buffer'

import '../../styles/Profile.css'

function UserProfile({userInfo, editable, action}) {
  const formatter = new Intl.NumberFormat('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})
  const {name, address, posts, followings, followers, cost, profilePic} = userInfo
  
  useEffect(() => {
    document.getElementById('profileImg').style.backgroundImage = `url("${ipfsData.protocol}://${ipfsData.host}/ipfs/${profilePic}")`    
  }, [profilePic])

  const [tooltipText, setToolTipText] = useState('Copiar al Portapapeles')
  const [hasChange, setHasChange] = useState(false)
  const [imgBuffer, setImgBuffer] = useState(undefined)
  const [componentAlert, setComponentAlert] = useState({type:'', text: '', link: '', linkText: ''})  
  const {web3, usersContract} = useLoadDapp()
  
  const dispatch = useDispatch()
  const {isProcessing, setIsProcessing, isAlert, setIsAlert} = useStatus()

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

  const formatNumber = (num) => {
      if (num >= 1000000000) {
         return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'b';
      }
      if (num >= 1000000) {
         return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
      }
      if (num >= 1000) {
         return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
      }
      return num;
  }

  const getUserNumbers = () => {
    const userNumbers = {Publicaciones: posts, Seguidores: followers, Seguidos: followings}
    
    return(
      <div className='d-flex flex-row justify-content-between align-items-center' style={{fontSize: '0.9rem', margin: '24px 0px 24px 0px'}}>
        {Object.keys(userNumbers).map((label, index) => {
          return(
            <OverlayTrigger key={index} placement='bottom' delay={{show: 1000}} overlay={<Tooltip id="tooltip-copy">{formatter.format(userNumbers[label])}</Tooltip>}>
              <div className='d-flex flex-column justify-content-center align-items-center'>
                <div style={{fontWeight: 'bold', cursor: 'pointer'}}>{formatNumber(userNumbers[label])}</div>
                <div>{label}</div>
              </div> 
            </OverlayTrigger>
          )
        })}
      </div>
    )
  }

  const getMainButton = () => {
    if(action === PROFILE_ACTIONS.UPDATE){
      return (<Button variant="primary" onClick={handleUpdate} disabled={!hasChange}>Guardar</Button>)
    } else {
      return(<></>)
    }
  }
  
  const handleUpdate = () => {
    dispatch(setIsAlert(false))
    
    const updatedName = document.getElementById('profileName').value
    const updatedCost = document.getElementById('profileCost').value

    if(updatedName.trim() === '' || updatedCost.trim() === '') {
      dispatch(setIsAlert(true))
      setComponentAlert({type: 'danger', text: 'Campos obligatorios.', link: '', linkText: ''})
    } else {
      dispatch(setIsProcessing(true))      
      setHasChange(false)
      updateUser(web3, address, usersContract, {name: updatedName, profilePic, cost: parseFloat(updatedCost), imgBuffer}, setIsProcessing, setIsAlert, setComponentAlert, setImgBuffer, dispatch)
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
        {getUserNumbers()}
        <div className='d-flex flex-column justify-content-center align-items-center' style={{fontSize: '0.9rem', margin: '24px 0px 24px 0px'}}>
          <Form.Group controlId="profileCost">
            <Form.Control className='profile-input profile-input-title' type="number" step={'any'} required defaultValue={cost} disabled={!editable} onChange={() => {setHasChange(true)}}/>
          </Form.Group>
          <div>Membresía (ETH)</div>
        </div>        
        {isAlert ? displayAlert(componentAlert.type, componentAlert.text, componentAlert.link, componentAlert.linkText) : <></>}
        {isProcessing ? <Spinner animation='grow' /> : getMainButton()}
        </Card.Body>
    </Card>
  )
}

export default UserProfile
