import axios from 'axios';

/**
 * คำนวณราคาห้องพักทั้งหมดที่ผู้ใช้เลือก
 * @param {Array} bookings - [{ roomId, checkInDate, checkOutDate, adults, children }]
 * @returns {Promise<{ breakdown: Array, grandTotal: number }>}
 */
const calculateTotalPrice = async (bookings) => {
  try {
    const response = await axios.post('/api/calculate-promotion', {
      bookings,
    });

    return response.data; // { results: [...], grandTotal: ... }
  } catch (error) {
    console.error('Error calculating total price:', error);
    throw error;
  }
};

export default {
  calculateTotalPrice,
};
