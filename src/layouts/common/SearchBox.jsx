import { useState, useEffect } from 'react';
import {
  Form,
  FormControl,
  Button,
  Row,
  Col,
  DropdownButton,
  InputGroup
} from 'react-bootstrap';
import { FaCalendarAlt, FaUserFriends } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import dayjs from 'dayjs';
import "dayjs/locale/th";
import th from 'date-fns/locale/th';
import { registerLocale } from 'react-datepicker';
registerLocale('th', th);

import formatToBE from '../../utils/FormatToBE';


export default function SearchBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const tomorrow = dayjs().add(1, 'day').startOf('day').toDate();

  useEffect(() => {
    const initialAdults = parseInt(searchParams.get('adults')) || 1;
    const initialChildren = parseInt(searchParams.get('children')) || 0;
    const initialCheckIn = searchParams.get('checkIn');
    const initialCheckOut = searchParams.get('checkOut');


    setAdults(initialAdults);
    setChildren(initialChildren);

    if (initialCheckIn) {
      setCheckInDate(dayjs(initialCheckIn).toDate());
    } else {
      setCheckInDate(dayjs().add(1, 'day').toDate());
    }

    if (initialCheckOut) {
      setCheckOutDate(dayjs(initialCheckOut).toDate());
    } else {
      setCheckOutDate(dayjs().add(2, 'day').toDate());
    }
  }, [searchParams]);

  useEffect(() => {
    const isValidCombo =
      (adults === 1 && (children === 2 || children === 3)) ||
      ((adults === 2 || adults === 3) && children === 1);

    if (!isValidCombo && children > 0) {
      alert(
        "รูปแบบผู้ใหญ่และเด็กที่เลือกไม่รองรับ:\nรองรับเฉพาะ:\n- ผู้ใหญ่ 1 เด็ก 2-3\n- ผู้ใหญ่ 2-3 เด็ก 1"
      );
      setChildren(0); // หรือจะ reset ทั้งคู่ก็ได้: setAdults(1); setChildren(0);
    }
  }, [adults, children]);

  useEffect(() => {
  const allowed = getAvailableChildrenOptions();
  if (!allowed.includes(children)) {
    setChildren(0); // reset ถ้าค่าเกินจากที่ควรเลือกได้
  }
}, [adults]);

  const getAvailableChildrenOptions = () => {
    if (adults === 4) return [0];
    if (adults === 2 || adults === 3) return [0, 1];
    if (adults === 1) return [0, 1, 2, 3];
    return [0]; // fallback
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    const params = new URLSearchParams({
      adults,
      children,
      checkIn: dayjs(checkInDate).format('YYYY-MM-DD'),
      checkOut: dayjs(checkOutDate).format('YYYY-MM-DD'),
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    navigate(`/search-results?${params.toString()}`);
    setLoading(false);
  };

  const handleCheckInDateChange = (date) => {
    setCheckInDate(date);
    if (!checkOutDate || dayjs(checkOutDate).isSame(date) || dayjs(checkOutDate).isBefore(date)) {
      const nextDate = dayjs(date).add(1, 'day').toDate();
      setCheckOutDate(nextDate);
    }
  };

  const handleCheckOutDateChange = (date) => {
    setCheckOutDate(date);
  };

  const CheckInDateInput = ({ value, onClick, placeholder, disabled }) => (
    <InputGroup className="custom-datepicker" onClick={onClick}>
      <InputGroup.Text className="bg-white border-end-0">
        <i className="bi bi-calendar-event text-primary"></i>
      </InputGroup.Text>
      <FormControl
        name='checkIn'
        id='checkIn'
        placeholder={placeholder}
        value={value}
        readOnly
        disabled={disabled}
        className="py-7 fs-6 border-start-0 shadow-sm"
      />
    </InputGroup>
  );

  const CheckOutDateInput = ({ value, onClick, placeholder, disabled }) => (
    <InputGroup className="custom-datepicker" onClick={onClick}>
      <InputGroup.Text className="bg-white border-end-0">
        <i className="bi bi-calendar-event text-primary"></i>
      </InputGroup.Text>
      <FormControl
        name='checkOut'
        id='checkOut'
        placeholder={placeholder}
        value={value}
        readOnly
        disabled={disabled}
        className="py-7 fs-6 border-start-0 shadow-sm"
      />
    </InputGroup>
  );

  return (
    <Form
      className="p-4 rounded bg-opacity-75 shadow-sm mx-auto"
      style={{
        maxWidth: '900px',
        backgroundColor: '#18abdb',
      }}
      onSubmit={handleSearch}
    >
      <div className="bg-white p-2 rounded shadow-sm">
        <Row className="align-items-end g-3">

          {/* Check-in */}
          <Col md>
            <DatePicker
              selected={checkInDate}
              onChange={handleCheckInDateChange}
              selectsStart
              startDate={checkInDate}
              endDate={checkOutDate}
              minDate={tomorrow}
              dateFormat="dd/MM/yyyy"
              locale="th"
              placeholderText="เลือกวันที่เช็คอิน"
              customInput={CheckInDateInput({ placeholder: formatToBE(checkInDate) })}
              popperContainer={({ children }) => (
                <div style={{ zIndex: 2000, position: "relative" }}>{children}</div>
              )}
            />
          </Col>

          {/* Check-out */}
          <Col md>
            <DatePicker
              selected={checkOutDate}
              onChange={handleCheckOutDateChange}
              selectsEnd
              startDate={checkInDate}
              endDate={checkOutDate}
              minDate={dayjs(checkInDate).add(1, 'day').toDate()}
              dateFormat="dd/MM/yyyy"
              locale="th"
              placeholderText="เลือกวันที่เช็คเอาท์"
              disabled={!checkInDate}
              customInput={CheckOutDateInput({ placeholder: formatToBE(checkOutDate), disabled: !checkInDate })}
              popperContainer={({ children }) => (
                <div style={{ zIndex: 2000, position: "relative" }}>{children}</div>
              )}
            />
          </Col>

          {/* Guests and Rooms Dropdown */}
          <Col md>
            <DropdownButton
              id="dropdown-guests"
              title={
                <span>
                  <FaUserFriends className="me-2" />
                  จำนวนผู้ใหญ่ และ เด็ก
                </span>
              }
              variant="outline-secondary"
            >
              <div className="px-3 py-2" style={{ minWidth: '220px' }}>
                <Form.Group className="mb-2">
                  <Form.Label>ผู้ใหญ่ (สูงสุด 4)</Form.Label>
                  <Form.Select
                    value={adults}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value === 0) return; // ไม่อนุญาต 0 ผู้ใหญ่
                      setAdults(value);
                    }}
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>เด็ก</Form.Label>
                  <Form.Select
                    value={children}
                    onChange={e => setChildren(Number(e.target.value))}
                    disabled={adults === 4}
                  >
                    {getAvailableChildrenOptions().map(n => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

              </div>
            </DropdownButton>
          </Col>

          {/* Search Button */}
          <Col xs="auto">
            <Button type="submit" className="w-100 px-4 text-white" style={{ backgroundColor: '#18abdb', borderColor: '#18abdb' }}>
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : (
                <i className="bi bi-search me-2" ></i>
              )}
              <span>ค้นหา</span>
            </Button>
          </Col>
        </Row>
      </div>
    </Form>
  );
}