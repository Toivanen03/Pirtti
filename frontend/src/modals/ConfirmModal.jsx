import { Button, Modal, Row, Col } from 'react-bootstrap'

const ConfirmModal = ({ title, setConfirmTitle, onConfirm, showCancel = false, cancelText = 'Peruuta', confirmText = 'Ok' }) => {
  const show = !!title

  const handleClose = () => setConfirmTitle(null)
  const handleConfirm = () => {
    onConfirm?.()
    handleClose()
  }

  let message = null
  let isError = false

  if (title && typeof title === 'string' && title.toLowerCase().startsWith('virhe: ')) {
    title = title.replace('Virhe:', '')
    if (title.toLowerCase().includes('error:')) {
      title = title.replace(/error:/i, '')
    }
    const lines = title.split('\n')
    message = (
      <div className="text-danger fw-bold">
        {lines.map((line, i) => (
          <div key={i}>{'- ' + line}</div>
        ))}
      </div>
    )
    isError = true
  } else if (title && typeof title === 'string' && (title.startsWith('Vahvista:') || title.startsWith('Haluatko'))) {
    let textClass
    title = title.replace('Vahvista:', '')
    const lines = title.split('\n')
    if (lines.includes('EI VOI')) textClass = 'red'
    message = (
      <div>
        {lines.map((line, i) => (
          <div key={i} style={{ color: line.includes('EI VOI') && 'red' }}>{<span>{line}</span>}</div>
        ))}
      </div>
    )
    isError = true
    showCancel = true
  } else {
    message = title
    isError = true
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header>
        <Modal.Title>{message}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        {showCancel ? (
          <Row className="justify-content-center">
            <Col xs="auto">
              <Button variant={isError ? 'warning' : 'info'} onClick={handleConfirm} style={{ minWidth: '80px' }}>
                {confirmText}
              </Button>
            </Col>

            <Col xs="auto">
              <Button variant="secondary" onClick={handleClose} style={{ minWidth: '80px' }}>
                {cancelText}
              </Button>
            </Col>
          </Row>
        ) : (
          <Button variant={isError ? 'primary' : 'success'} onClick={handleConfirm} style={{ minWidth: '80px' }}>
            {confirmText}
          </Button>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default ConfirmModal