import { Modal } from 'react-bootstrap'
import BookingList from './BookingList'

const BookingListModal = ({show, onHide}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <BookingList />
      </Modal.Body>
    </Modal>
  )
}

export default BookingListModal