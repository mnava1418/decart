import { useState } from 'react'
import { Modal, Button, Form } from "react-bootstrap"
import { SITE_URL, PATHS } from '../config'

function TermsModal({show, confirm, cancel}) {

  const termURL = `${SITE_URL[process.env.NODE_ENV]}${PATHS.terms}`
  const [userCheck, setUserCheck] = useState(false)

  const handleConfirm = () => {
    setUserCheck(false)
    confirm()
  }
  
  return (
    <Modal show={show} onHide={cancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Terms and Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>By completing and submitting this form you agree to the terms and conditions. A fully copy of the T&C can be viewed at <a href={termURL} rel="noreferrer" target={"_blank"}>{termURL}</a></p>
          <Form.Check id="termsCheck" type="checkbox" label="I agree to the terms and conditions." defaultChecked={userCheck} onClick={() => setUserCheck(!userCheck)}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={!userCheck}>
            Continue
          </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default TermsModal