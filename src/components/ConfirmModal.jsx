import { Modal, Button } from "react-bootstrap"

function ConfirmModal({show, title, text, cancel, confirm}) {
  return (
    <Modal show={show} onHide={cancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{text}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirm}>
            Continue
          </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default ConfirmModal