
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import '../Dashboard.css';

// Miguel Angel Vargas Valenica
// For clients to book a meeting or user to book

function BookingPage() {
    const { ownerId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [slots, setSlots] = useState([]);
    const [ownerName, setOwnerName] = useState(location.state?.ownerName || `Professor ${ownerId}`);

    useEffect(() => {
        async function fetchSlots() {
            try {
                const response = await fetch(`http://winter2026-comp307-group15.cs.mcgill.ca:5000/api/slots?owner_id=${ownerId}`);
                const data = await response.json();
                if (response.ok) {
                    setSlots(data.active_requests || []);
                } else {
                    console.error("Failed to fetch slots:", data.message);
                }
            } catch (error) {
                console.error("Error fetching slots:", error);
            }
        }
        fetchSlots();
    }, [ownerId]);

    const handleBookSlot = (slotId) => {
        // Logic to book a slot
        alert(`You have booked slot ${slotId}. A confirmation email has been sent.`);
        // You might want to update the slot's status and navigate away or show a success message
        // For now, we'll just simulate the booking
        setSlots(prevSlots => prevSlots.map(slot => 
            slot.slot_id === slotId ? { ...slot, isBooked: true } : slot
        ));
    };

    return (
        <main>
             <div className="navBar" id="navBar">
                <div>
                    <img src="/mcbooking.png" alt="mcbooking logo"></img>
                </div>
                <div className="menu">
                    <a href="/dashboard" id="dashboard" > Dashboard </a>
                    <button id="exit" onClick={() => navigate('/')}> Log Out </button>
                </div>
            </div>

            <h1>Available Slots for {ownerName}</h1>
            <div id="bookingList">
                {slots.length === 0 ? <p style={{textAlign: 'center', marginTop: '2rem'}}>No active slots currently available.</p> : slots.map((slot) => (
                    <div className="card" key={slot.slot_id}>
                        <div className="header-line">
                            <h3>{slot.slot_title || String(slot.start_time).split('T')[0]}</h3>
                        </div>
                        <p>Date: {String(slot.start_time).split('T')[0]}</p>
                        <p>Time: {String(slot.start_time).split('T')[1]} - {String(slot.end_time).split('T')[1]}</p>
                        {slot.isBooked ? (
                            <button disabled>Booked</button>
                        ) : (
                            <button onClick={() => handleBookSlot(slot.slot_id)}>Book Now</button>
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
}

export default BookingPage;
