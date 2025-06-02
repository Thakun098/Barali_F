import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Row, Col, Table } from 'react-bootstrap';

const BookingConfirmation = () => {
  const { state } = useLocation();
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(state || null);
  const [user, setUser] = useState(null); // 👈 ดึง user จาก localStorage

  useEffect(() => {
    if (!state) {
      navigate('/');
    }
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [state, navigate]);

  if (!paymentData || !user) return null;

  const {
    roomIds,
    checkIn,
    checkOut,
    adults,
    children,
    totalPrice,
    specialRequest,
  } = paymentData;

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
            <td>{checkIn}</td>
          </tr>
          <tr>
            <td>วันที่เช็คเอาท์</td>
            <td>{checkOut}</td>
          </tr>
          <tr>
            <td>จำนวนห้อง</td>
            <td>{roomIds.length}</td>
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
            <td>{totalPrice.toLocaleString()} บาท</td>
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
