import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Card, Button, Tooltip, OverlayTrigger, Form, Spinner } from 'react-bootstrap'
import identicon from 'identicon/dist/identicon'
import { PROFILE_ACTIONS, ipfsData } from '../../config'
import { displayAlert, getUserNumbers } from '../helpers'
import { updateUser } from '../../services/usersService'
import useStatus from '../../hooks/useStatus'
import { Buffer } from 'buffer'
import { setIsProcessingGlobal, setComponentAlertGlobal } from '../../store/slices/statusSlice'

import '../../styles/Profile.css'

export const PROFILE_IMG_INPUT_ID = 'profileImg'
export const PROFILE_COVER_INPUT_ID = 'profileCover'

function UserProfile({userInfo, editable, action}) {
  const {name, email, address, posts, followings, followers, cost, profilePic} = userInfo
  
  useEffect(() => {
    if(profilePic.trim() === '') {
      generateRandomProfilePic()
    } else {
      loadIpfsImage(PROFILE_IMG_INPUT_ID, profilePic)      
    }    

    // eslint-disable-next-line
  }, [])

  const [tooltipText, setToolTipText] = useState('Copiar al Portapapeles')
  const [hasChange, setHasChange] = useState(false)
  const [imgBuffer, setImgBuffer] = useState({})
  const [selectedImg, setSelectedImg] = useState('')
  const [validated, setValidated] = useState(false)

  
  const dispatch = useDispatch()
  const {isProcessing, componentAlert} = useStatus()

  const formatAddress = () => {
    return `${address.substring(0,5)}...${address.substring(address.length - 4, address.length)}`
  }

  const loadIpfsImage = (inputId, imageHash) => {
    document.getElementById(inputId).style.backgroundImage = `url("${ipfsData.protocol}://${ipfsData.host}/ipfs/${imageHash}")`
  }

  const generateRandomProfilePic = () => {
     const buffer = identicon.generateSync(address, 100)
    const img = new Image()
    img.src = buffer
    document.getElementById(PROFILE_IMG_INPUT_ID).innerHTML = ''
    document.getElementById(PROFILE_IMG_INPUT_ID).appendChild(img)    
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
    setValidated(false)

    const form = document.getElementById('userProfileForm')

    if(form.checkValidity() === true) {
      dispatch(setIsProcessingGlobal(true))
      setHasChange(false)
      updateUser()
    } else {
      setValidated(true)
    }
  }

  const loadProfilePic = () => {
    const profileFile = document.getElementById('profileFile').files[0]
    readImageAsURL(profileFile)
    readImageAsBuffer(profileFile)
    setHasChange(true)
  }    

  const readImageAsURL = (profileFile) => {
    const reader = new FileReader()

    reader.onloadend = () => {
        if(selectedImg === PROFILE_IMG_INPUT_ID) {
          document.getElementById(selectedImg).innerHTML = ''
        }

        document.getElementById(selectedImg).style.backgroundImage = `url(${reader.result})`
    }

    if(profileFile) {
        reader.readAsDataURL(profileFile)            
    }
  }

  const readImageAsBuffer = (profileFile) => {
    const reader = new FileReader()

    reader.onloadend = () => {            
        const buffer = Buffer.from(reader.result)
        setImgBuffer({...imgBuffer, [selectedImg]: buffer})        
    }

    if(profileFile) {
        reader.readAsArrayBuffer(profileFile)
    }
  }

  const selectImage = (event, inputId) => {
    if(editable) {      
      setSelectedImg(inputId)
      document.getElementById('profileFile').click()
    } 

    event.stopPropagation()
  }

  return (
    <Form id='userProfileForm' noValidate validated={validated}>
      <Card className='main-element' style={{ width: '18rem' }}>   
          <div id={PROFILE_COVER_INPUT_ID} className='bg-image bg-image-cover profile-card-background d-flex flex-column justify-content-center align-items-center' onClick={(e) => {selectImage(e, PROFILE_COVER_INPUT_ID)}}>
            <div id={PROFILE_IMG_INPUT_ID} className='bg-image bg-image-cover profile-img profile-card-img d-flex flex-column justify-content-center align-items-center' onClick={(e) => {selectImage(e, PROFILE_IMG_INPUT_ID)}}/>
          </div>  
          <Form.Control id="profileFile" type="file" accept="image/*" hidden onChange={loadProfilePic}/>
          <Card.Body style={{marginTop: '50px'}}>
          <Card.Title>
            <Form.Group controlId="profileName">
              <Form.Control className='profile-input profile-input-title' type="text" required defaultValue={name} placeholder='Enter your username' disabled={!editable} onChange={() => {setHasChange(true)}}/>
            </Form.Group>
          </Card.Title>
          <Card.Title>
            <Form.Group controlId="profileEmail">
              <Form.Control className='profile-input' type="email" required defaultValue={email} placeholder='Enter your email' disabled={!editable} onChange={() => {setHasChange(true)}}/>
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
    </Form>
  )
}

export default UserProfile
