import dayjs from 'dayjs';
import AccommodationService from '../../services/api/accommodation/accommodation.service';
 
const GetRoomAvailability = async (checkInDate, checkOutDate) => {
  try {
    const formattedCheckIn = dayjs(checkInDate).format('YYYY-MM-DD');
    const formattedCheckOut = dayjs(checkOutDate).format('YYYY-MM-DD');
 
    if (!formattedCheckIn || !formattedCheckOut) {
      console.error('Invalid dates');
      return {};
    }
 
    const res = await AccommodationService.getAvailablePromotions(
      formattedCheckIn,
      formattedCheckOut
    );
 
    const data = res?.data;
 
    if (!Array.isArray(data)) {
      console.warn('⚠️ No valid availableByType array found');
      return {};
    }
 
    const availabilityMap = data.reduce((map, item) => {
        const typeId = item.type_id;
      map[typeId] = (map[typeId] || 0) + 1;
      console.log("✅ item", item);
      return map;
    }, {});
 
    console.log("✅ availabilityMap", availabilityMap);

 
    return availabilityMap;
  } catch (err) {
    console.error('Error fetching availability:', err);
    return {};
  }
};
 
export default GetRoomAvailability;