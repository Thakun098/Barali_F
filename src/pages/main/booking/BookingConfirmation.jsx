import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Row, Col, Table, Spinner, Alert, Form } from 'react-bootstrap';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { format } from 'date-fns';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const BookingConfirmation = () => {
  const { state } = useLocation();
  const { paymentId } = useParams();
  const navigate = useNavigate();

  const [paymentData, setPaymentData] = useState(state || null);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(!!paymentId);
  const [error, setError] = useState(null);
  const [inputPaymentId, setInputPaymentId] = useState('');
  const [isFetchingById, setIsFetchingById] = useState(false);

  // โหลด user จาก localStorage แค่ครั้งเดียว
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // โหลด payment data หากมี paymentId หรือ state
  useEffect(() => {
    if (paymentId) {
      fetchPayment(paymentId);
    } else if (state) {
      setPaymentData(state);
    }
  }, [paymentId, state]);

  const fetchPayment = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/payment/${id}`);
      setPaymentData(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching payment:', err);
      setPaymentData(null);
      setError('ไม่พบข้อมูลการชำระเงินสำหรับ ID นี้');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = async (e) => {
    e.preventDefault();
    if (!inputPaymentId.trim()) return;

    setIsFetchingById(true);
    await fetchPayment(inputPaymentId);
    setIsFetchingById(false);
  };

  if (loading || isFetchingById) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
        <p className="mt-3">กำลังโหลดข้อมูล...</p>
      </Container>
    );
  }

  if (!paymentData) {
    return (
      <Container className="my-5" style={{ maxWidth: 500 }}>
        <h5 className="mb-4 text-center">กรอกรหัสการชำระเงิน</h5>
        {error && <Alert variant="danger" dismissible>{error}</Alert>}
        <Form onSubmit={handleManualSearch}>
          <Form.Group controlId="paymentId">
            <Form.Label>Payment ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="เช่น 123456"
              value={inputPaymentId}
              onChange={(e) => setInputPaymentId(e.target.value)}
            />
          </Form.Group>
          <div className="mt-3 d-flex justify-content-between">
            <Button variant="secondary" onClick={() => navigate('/')}>กลับหน้าหลัก</Button>
            <Button variant="primary" type="submit" disabled={isFetchingById}>ค้นหา</Button>
          </div>
        </Form>
      </Container>
    );
  }

  const {
    id,
    roomIds,
    checkIn,
    checkOut,
    adults,
    children,
    totalPrice,
    dueDate
  } = paymentData;

  const handleMockPayment = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/payment/confirm/${paymentData._id}`);
      console.log('Payment confirmed:', res.data);
      alert('อัปเดตสถานะเป็น "ชำระเงินแล้ว" สำเร็จ');
      setPaymentData({ ...paymentData, status: 'paid' }); // จำลองการอัปเดตสถานะ
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };

  const formatDate = (dateStr) =>
    dateStr ? dayjs(dateStr).locale('th').format('DD MMMM YYYY') : '-';

  return (
    <Container className="my-5 p-4 border rounded shadow-sm bg-white" style={{ maxWidth: 700 }}>
      <div className="d-flex align-items-start mb-4">
  <img
    src="https://www.baraliresort.com/images/logo.png"
    alt="Barali Logo"
    style={{ height: 80 }}
  />
  <div className="ms-3">
    <span className="fw-medium d-block">บาราลี บีช รีสอร์ท</span>
    <span className="d-block text-muted small">77 หาดคลองพร้าว เกาะช้าง</span>
    <span className="d-block text-muted small">23170 จังหวัดตราด ประเทศไทย</span>
  </div>
  <div className="ms-auto text-end">
    <span>หมายเลขการชำระเงิน: {id}</span>
  </div>
</div>
      <div className="mb-3">
        <h5 className="mt-3 text-center ">สรุปข้อมูลการจอง</h5>
      </div>

      <Row className="mb-3 bg-info bg-opacity-25 p-1 text-center">
        <Col><medium>ข้อมูลผู้จอง</medium></Col>
      </Row>


      <div className="mb-2 d-flex justify-content-between align-items-center px-3 py-2 ">
        <div><medium>ชื่อผู้เข้าพัก</medium></div>
        <div>{user?.name || '-'} {user?.lastname || '-'}</div>
      </div>

      <div className="mb-2 d-flex justify-content-between align-items-center px-3 py-2 ">
        <div><medium>อีเมล</medium></div>
        <div>{user?.email || '-'}</div>
      </div>

      <Row className="mt-4 mb-3 bg-info bg-opacity-25 p-1 text-center">
        <Col><medium>รายละเอียดการจอง</medium></Col>
      </Row>
      
        
          <div className="mb-2 d-flex justify-content-between align-items-center px-3 py-2 ">
            <div><medium>วันที่เช็คอิน</medium></div>
            <div>{formatDate(checkIn)}</div>
          </div>
          <div className="mb-2 d-flex justify-content-between align-items-center px-3 py-2 ">
            <div><medium>วันที่เช็คเอาท์</medium></div>
            <div>{formatDate(checkOut)}</div>
          </div>
          <div className="mb-2 d-flex justify-content-between align-items-center px-3 py-2 ">
            <div><medium>จำนวนห้อง</medium></div>
            <div>{Array.isArray(roomIds) ? roomIds.length : '-'}</div>
          </div>
          <div className="mb-2 d-flex justify-content-between align-items-center px-3 py-2 ">
            <div><medium>ผู้ใหญ่</medium></div>
            <div>{adults ?? '-'}</div>
          </div>
          <div className="mb-2 d-flex justify-content-between align-items-center px-3 py-2 ">
            <div><medium>เด็ก</medium></div>
            <div>{children ?? '-'}</div>
          </div>
        
      

      <Row className="mt-4 mb-3 bg-info bg-opacity-25 p-1 text-center">
        <Col><medium>ราคาทั้งหมด</medium></Col>
      </Row>
      
        
          <div className="mb-2 d-flex justify-content-between align-items-center px-3 py-2 ">
            <div><medium>ยอดรวม</medium></div>
            <div>{!isNaN(parseInt(totalPrice)) ? parseInt(totalPrice).toLocaleString() : '-'}</div>
          </div>
          <div className="mb-2 d-flex justify-content-between align-items-center px-3 py-2 ">
            <div><medium>วันครบกําหนดชําระ</medium></div>
            <div>{formatDate(dueDate)}</div>
          </div>
        
      

      {paymentData?.status !== 'paid' ? (
        <>
          <Row className="mt-4 mb-3 text-center">
            <Col><medium>QR Code สำหรับชำระเงิน (จำลอง)</medium></Col>
          </Row>
          <div className="text-center mb-3">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://www.youtube.com/watch?v=8WCmS9fIlZo`}
              alt="QR Code"
              style={{ border: '1px solid #ccc', padding: 10, background: '#fff' }}
            />
            <div className="text-muted mt-2" style={{ fontSize: '0.9em' }}>
              สแกนเพื่อชำระเงิน (ปลอม ๆ 😆)
            </div>
          </div>

          <div className="text-center">
            <Button variant="success" onClick={handleMockPayment}>
              ฉันได้ชำระเงินแล้ว (จำลอง)
            </Button>
          </div>
        </>
      ) : (
        <Alert variant="success" className="mt-4 text-center">
          ✅ ชำระเงินเรียบร้อยแล้ว
        </Alert>
      )}
    </Container>
  );
};

export default BookingConfirmation;
