import {useState} from 'react'
import { Form, Button,InputGroup, Spinner } from 'react-bootstrap'
import { createUser, getRegistrationCost, uploadImg } from '../../services/usersService'
import ConfirmModal from '../ConfirmModal'
import { displayAlert } from '../helpers'
import useLoadDapp from '../../hooks/useLoadDapp'
import { REGISTRATION_COST } from '../../config'
import { Buffer } from 'buffer'

import '../../styles/Register.css'

function Register() {
    const [validated, setValidated] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [showAlert, setShowAlert] = useState({show: false, type:'', text: '', link: '', linkText: ''})

    const [cost, setCost] = useState(0.0)
    const [imgBuffer, setImgBuffer] = useState(undefined)
    const {web3, account, usersContract} = useLoadDapp()    

    const handleRegister = async () => {        
        setShowAlert({...showAlert, show: false})
        const form = document.getElementById('registerForm')

        if(form.checkValidity()) {
            setIsProcessing(true)            
            const registrationCost = await getRegistrationCost()

            if(registrationCost > 0.0) {
                setCost(registrationCost)
                setShowModal(true)
            } else {
                setShowAlert({show: true, type: 'danger', text: 'Error al calcular el precio del ETH.', link: '', linkText: ''})
                setIsProcessing(false)
            }

        } else {
            setValidated(true)
        }
    }

    const handleContinue = async () => {
        const userInfo = await getUserInfo()
        createUser(web3, account, usersContract, userInfo, cost, setShowAlert, setIsProcessing)
        setShowModal(false)
    }

    const loadProfilePic = () => {
        document.getElementById('profileIcon').classList.remove('d-flex')
        document.getElementById('profileIcon').style.display = 'none'

        const profilePic = document.getElementById('profileFile').files[0]
        readProfilePicAsURL(profilePic)
        readProfilePicAsBuffer(profilePic)
    }    

    const readProfilePicAsURL = (profilePic) => {
        const reader = new FileReader()

        reader.onloadend = () => {
            document.getElementById('profileImg').style.backgroundImage = `url(${reader.result})`            
        }

        if(profilePic) {
            reader.readAsDataURL(profilePic)            
        }
    }

    const readProfilePicAsBuffer = (profilePic) => {
        const reader = new FileReader()

        reader.onloadend = () => {            
            const buffer = Buffer.from(reader.result)
            setImgBuffer(buffer)            
        }

        if(profilePic) {
            reader.readAsArrayBuffer(profilePic)
        }
    }

    const getUserInfo = async() => {
        const profilePic = await uploadImg(imgBuffer)
        //const profilePic = 'QmNmBvj2e7vjzgppVPfAiSmsH1KwaiUeNU2Hc3nX1w4Pgd'

        const userInfo = {
            name: document.getElementById('formName').value,
            email: document.getElementById('formEmail').value,            
            cost: parseFloat(document.getElementById('formCost').value),
            profilePic,
        }

        return userInfo
    }
    
    return (
        <div className='register-main'>
            <div className='bg-image bg-image-cover register-image'></div>
            <div className='register-form d-flex flex-column justify-content-center align-items-center'>                
                <div id='profileImg' className='profile-img profile-register bg-image bg-image-cover d-flex flex-column justify-content-center align-items-center' onClick={() => {document.getElementById('profileFile').click()}}>
                    <i id="profileIcon" className="bi bi-camera-fill d-flex flex-column justify-content-center align-items-center"><span style={{fontSize: '0.9rem', fontWeight: 'bold'}}>150x150 px</span></i>                        
                </div>                                                    
                <Form.Control id="profileFile" type="file" accept="image/*" hidden onChange={loadProfilePic}/>
                <Form id="registerForm" noValidate validated={validated}>
                    <Form.Group className="mb-3" controlId="formName" style={{marginTop: '40px'}}>
                        <Form.Control required type="text" className='register-input' placeholder='Nombre' />
                        <Form.Control.Feedback type="invalid">Campo obligatorio.</Form.Control.Feedback>
                    </Form.Group>                
                    <Form.Group className="mb-3" controlId="formEmail" style={{marginTop: '40px'}}>                    
                        <Form.Control required type="email" className='register-input' placeholder='Email' />
                        <Form.Control.Feedback type="invalid">Email inválido.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formCost" style={{marginTop: '40px'}}>      
                        <div className='d-flex flex-row justify-content-center'>
                            <Form.Control required type="number" step={'any'} className='register-input' placeholder='Membresía' style={{border: '0px!important'}} />
                            <InputGroup.Text>ETH</InputGroup.Text>
                        </div>
                        <Form.Text  muted style={{fontSize: '0.9rem'}}>
                            *Pago único para que la gente te pueda seguir. Si la membresía es 0 eth, tu perfil será público.
                        </Form.Text>                        
                    </Form.Group>         
                    {showAlert.show ? displayAlert(showAlert.type, showAlert.text, showAlert.link, showAlert.linkText) : <></>}       
                    {isProcessing ? <Spinner animation="grow" style={{marginTop: '40px'}} /> : <Button variant='primary' style={{marginTop: '40px'}} onClick={handleRegister}>Registrarse</Button>}
                </Form>
            </div>
            <ConfirmModal show={showModal} title={'Registrar Usuario'} text={`Se te hará un único cargo de ${cost} ETH equivalente a ${REGISTRATION_COST} USD`} cancel={() => {setShowModal(false); setIsProcessing(false)}} confirm={handleContinue} />
        </div>
    )
}

export default Register
