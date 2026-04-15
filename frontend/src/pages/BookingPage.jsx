import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../Dashboard.css";

// Miguel Angel Vargas Valencia
// For clients to book a meeting or user to book

function BookingPage() {
    const { ownerId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [slots, setSlots] = useState([]);
    const [ownerName] = useState(location.state?.ownerName || `Professor ${ownerId}`);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchSlots() {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `http://winter2026-comp307-group15.cs.mcgill.ca:5000/api/owner_active_slots?owner_id=${ownerId}`
                );

                const data = await response.json();

                if (response.ok) {
                    setSlots(data.active_requests || []);
                } else if (response.status === 404) {
                    setError("Owner not found.");
                } else {
                    setError(data.message || "Failed to fetch slots.");
                }
            } catch (err) {
                console.error("Error fetching slots:", err);
                setError("Could not connect to the server.");
            } finally {
                setLoading(false);
            }
        }

        fetchSlots();
    }, [ownerId]);

    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleDateString([], {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    const formatTime = (isoString) => {
        return new Date(isoString).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const handleBookSlot = (slotId) => {
        alert(`You have booked slot ${slotId}. A confirmation email has been sent.`);
        setSlots((prevSlots) =>
            prevSlots.map((slot) =>
                slot.slot_id === slotId ? { ...slot, isBooked: true } : slot
            )
        );
    };

    return (
        <main>
            <div className="navBar" id="navBar">
                <div>
                    <img src="/mcbooking.png" alt="mcbooking logo" />
                </div>
                <div className="menu">
                    <a href="/dashboard" id="dashboard">Dashboard</a>
                    <button id="exit" onClick={() => navigate("/")}>Log Out</button>
                </div>
            </div>

            <h1>Available Slots for {ownerName}</h1>

            <div id="bookingList">
                {loading && (
                    <p style={{ textAlign: "center", marginTop: "2rem" }}>
                        Loading slots...
                    </p>
                )}

                {error && (
                    <p style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>
                        {error}
                    </p>
                )}

                {!loading && !error && slots.length === 0 && (
                    <p style={{ textAlign: "center", marginTop: "2rem" }}>
                        No active slots currently available.
                    </p>
                )}

                {!loading && !error && slots.map((slot) => (
                    <div className="card" key={slot.slot_id}>
                        <div className="header-line">
                            <h3>{slot.slot_title}</h3>
                        </div>
                        <p>Date: {formatDate(slot.start_time)}</p>
                        <p>
                            Time: {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                        </p>

                        {slot.isBooked ? (
                            <button disabled>Booked</button>
                        ) : (
                            <button onClick={() => handleBookSlot(slot.slot_id)}>
                                Book Now
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
}

export default BookingPage;