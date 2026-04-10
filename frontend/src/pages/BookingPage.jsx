
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../Dashboard.css';

// Miguel Angel Vargas Valenica
// For clients to book a meeting or user to book

function BookingPage() {
    const { ownerId } = useParams();
    const navigate = useNavigate();
    const [slots, setSlots] = useState([]);
    const [ownerName, setOwnerName] = useState("");

    // Mock data for slots and owner name
    useEffect(() => {
        // In a real app, you would fetch this data based on the ownerId
        setOwnerName(`Professor ${ownerId}`);
        const mockSlots = [
            { id: 1, date: "2024-12-25", startTime: "10:00", endTime: "11:00", isBooked: false },
            { id: 2, date: "2024-12-25", startTime: "11:00", endTime: "12:00", isBooked: true },
            { id: 3, date: "2024-12-26", startTime: "14:00", endTime: "15:00", isBooked: false },
        ];
        setSlots(mockSlots);
    }, [ownerId]);

    const handleBookSlot = (slotId) => {
        // Logic to book a slot
        alert(`You have booked slot ${slotId}. A confirmation email has been sent.`);
        // You might want to update the slot's status and navigate away or show a success message
        // For now, we'll just simulate the booking
        setSlots(prevSlots => prevSlots.map(slot => 
            slot.id === slotId ? { ...slot, isBooked: true } : slot
        ));
    };

    return (
        <main>
             <div className="navBar" id="navBar">
                <div>
                    <img src="mcbooking.png" alt="mcbooking logo"></img>
                </div>
                <div className="menu">
                    <a href="/dashboard" id="dashboard" > Dashboard </a>
                    <button id="exit" onClick={() => navigate('/')}> Log Out </button>
                </div>
            </div>

            <h1>Available Slots for {ownerName}</h1>
            <div id="bookingList">
                {slots.map((slot) => (
                    <div className="card" key={slot.id}>
                        <div className="header-line">
                            <h3>{slot.date}</h3>
                        </div>
                        <p>Time: {slot.startTime} - {slot.endTime}</p>
                        {slot.isBooked ? (
                            <button disabled>Booked</button>
                        ) : (
                            <button onClick={() => handleBookSlot(slot.id)}>Book Now</button>
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
}

export default BookingPage;
