import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

const BookingList = () => {

const [selectedAccommodation, setSelectedAccommodation] = useState([]);
const navigate = useNavigate();

  useEffect(() => {
  const storedAccommodation = localStorage.getItem("selectedAccommodation");
  if (storedAccommodation) {
    try {
      const parsed = JSON.parse(storedAccommodation);
      setSelectedAccommodation(parsed);
    } catch (error) {
      console.error("Failed to parse stored selected accommodation:", error);
      localStorage.removeItem("selectedAccommodation");
    }
  }
}, [selectedAccommodation]);













  return (
    <div>{selectedAccommodation.map((acc) => (
      <div key={acc.id}>
        <h2>{acc.name}</h2>
        <p>{acc.description}</p>
        <button onClick={""}>View Details</button>
      </div>
    ))
    }</div>
  )
}

export default BookingList