import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Row, Col, Table, Spinner, Alert, Form } from 'react-bootstrap';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/th';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const BookingConfirmation = () => {
  const { state } = useLocation();
  const { paymentId } = useParams();
  const navigate = useNavigate();

  const [paymentData, setPaymentData] = useState(state || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!paymentId);
  const [error, setError] = useState(null);
  const [manualId, setManualId] = useState(''); // 🆕 ใช้สำหรับ input id เอง
  const [fetching, setFetching] = useState(false); // เพื่อควบคุม spinner เวลา fetch

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

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
      console.log(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching payment:", err);
      setError("ไม่พบข้อมูลการชำระเงินสำหรับ ID นี้");
      setPaymentData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitId = (e) => {
    e.preventDefault();
    if (manualId.trim()) {
      setFetching(true);
      fetchPayment(manualId).finally(() => setFetching(false));
    }
  };

  if (loading || fetching) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status" />
        <p className="mt-3">กำลังโหลดข้อมูล...</p>
      </Container>
    );
  }

  if (!paymentData) {
    return (
      <Container className="my-5" style={{ maxWidth: 500 }}>
        <h5 className="mb-4 text-center">กรอกรหัสการชำระเงิน</h5>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmitId}>
          <Form.Group controlId="paymentId">
            <Form.Label>Payment ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="เช่น 123456"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
            />
          </Form.Group>
          <div className="mt-3 d-flex justify-content-between">
            <Button variant="secondary" onClick={() => navigate('/')}>
              กลับหน้าหลัก
            </Button>
            <Button variant="primary" type="submit" disabled={fetching}>
              ค้นหา
            </Button>
          </div>
        </Form>
      </Container>
    );
  }

  const {
    roomIds,
    checkIn,
    checkOut,
    adults,
    children,
    totalPrice,
    // specialRequest,
  } = paymentData;
  console.log(paymentData);

  return (
    <Container className="my-5 p-4 border rounded shadow-sm bg-white" style={{ maxWidth: 700 }}>
      <div className="text-center mb-4">
        <img src="https://www.baraliresort.com/images/logo.png" alt="Barali Logo" style={{ height: 80 }} />
        <h5 className="mt-3">สรุปข้อมูลการจอง</h5>
      </div>

      <Row className="mb-3">
        <Col><strong>ข้อมูลผู้จอง</strong></Col>
      </Row>
      <Table bordered>
        <tbody>
          <tr>
            <td>ชื่อผู้จอง</td>
            <td>{user?.name || '-'}</td>
          </tr>
          <tr>
            <td>อีเมล</td>
            <td>{user?.email || '-'}</td>
          </tr>
        </tbody>
      </Table>

      <Row className="mt-4 mb-3">
        <Col><strong>รายละเอียดการจอง</strong></Col>
      </Row>
      <Table bordered>
        <tbody>
          <tr>
            <td>วันที่เช็คอิน</td>
            <td>{dayjs(checkIn).locale('th').format('DD MMMM YYYY')}</td>
          </tr>
          <tr>
            <td>วันที่เช็คเอาท์</td>
            <td>{dayjs(checkOut).locale('th').format('DD MMMM YYYY')}</td>
          </tr>
          <tr>
            <td>จำนวนห้อง</td>
            <td>{roomIds?.length || '-'}</td>
          </tr>
          <tr>
            <td>ผู้ใหญ่</td>
            <td>{adults}</td>
          </tr>
          <tr>
            <td>เด็ก</td>
            <td>{children}</td>
          </tr>
        </tbody>
      </Table>

      <Row className="mt-4 mb-3">
  <Col><strong>ราคาทั้งหมด</strong></Col>
</Row>
<Table bordered>
  <tbody>
    <tr>
      <td>ยอดรวม</td>
      <td>{parseInt(totalPrice)?.toLocaleString() || '-'} บาท</td>
    </tr>
    <tr>
      <td>ครบกำหนดชำระ</td>
      <td>{paymentData?.dueDate ? dayjs(paymentData.dueDate).locale('th').format('DD MMMM YYYY') : '-'}</td>
    </tr>
  </tbody>
</Table>

      <div className="d-flex justify-content-between mt-4">
        <Button variant="secondary" onClick={() => navigate(-1)}>ย้อนกลับ</Button>
        <Button variant="primary">ชำระเงิน</Button>
      </div>
    </Container>
  );
};

export default BookingConfirmation;
