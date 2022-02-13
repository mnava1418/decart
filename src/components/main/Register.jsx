import {useState} from 'react'
import { Form, Button,InputGroup, Spinner } from 'react-bootstrap'

import '../../styles/Register.css'

function Register() {
    const [validated, setValidated] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    const handleRegister = () => {
        const form = document.getElementById('registerForm')

        if(form.checkValidity()) {
            setIsProcessing(true)

        } else {
            setValidated(true)
        }
    }

    const loadProfilePic = () => {
        document.getElementById('profileIcon').classList.remove('d-flex')
        document.getElementById('profileIcon').style.display = 'none'

        const profilePic = document.getElementById('profileFile').files[0]
        const reader = new FileReader()

        reader.onloadend = () => {
            document.getElementById('profileImg').style.backgroundImage = `url(${reader.result})`
        }

        if(profilePic) {
            reader.readAsDataURL(profilePic)
        }
    }    
    
    return (
        <div className='register-main'>
            <div className='bg-image bg-image-cover register-image'></div>
            <div className='register-form d-flex flex-column justify-content-center align-items-center'>                
                <div id='profileImg' className='profile-img bg-image bg-image-cover d-flex flex-column justify-content-center align-items-center' onClick={() => {document.getElementById('profileFile').click()}}>
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
                    {isProcessing ? <Spinner animation="grow" style={{marginTop: '40px'}} /> : <Button variant='primary' style={{marginTop: '40px'}} onClick={handleRegister}>Registrarse</Button>}
                </Form>
            </div>
        </div>
    )
}

export default Register
       