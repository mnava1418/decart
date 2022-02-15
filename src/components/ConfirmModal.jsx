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
            Cancelar
          </Button>
          <Button variant="primary" onClick={confirm}>
            Continuar
          </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default ConfirmModal