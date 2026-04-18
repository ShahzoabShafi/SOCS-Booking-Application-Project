// Import necessary React hooks and components from react-router-dom for navigation and parameter handling.
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import '../Dashboard.css';

//  Miguel Angel Vargas Valenica
// This component handles the booking of a meeting slot by a client or user.

function BookingPage() {
    const { ownerId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [slots, setSlots] = useState([]);
    // State to store the owner's name, retrieved from location state or defaults to a generic name.
    const [ownerName] = useState(location.state?.ownerName || `Professor ${ownerId}`);
    // State to manage the loading status while fetching data.
    const [loading, setLoading] = useState(true);
    // State to store any potential errors.
    const [error, setError] = useState(null);

    // using  hook to fetch active slots for the specific owner when the component mounts or ownerId changes.
    useEffect(() => {
        async function fetchSlots() {
            try {
                // Fetches active slots for the given ownerId from the API.
                const response = await fetch(
                    `http://winter2026-comp307-group15.cs.mcgill.ca:5000/api/slots/owner_active_slots?owner_id=${ownerId}`
                );
                // Parses the JSON response from the server.
                const data = await response.json();
                // Checks if the HTTP response is successful.
                if (response.ok) {
                      // Updates the 'slots' state with the fetched data, or an empty array if none exist.
                    setSlots(data.active_slots || []);
                } else if (response.status === 404) {
                       // Seting a specific error message if the owner is not found.
                    setError("Owner not found.");
                } else {
                    setError(data.message || "Failed to fetch slots.");
                }
            } catch (err) {
                setError("Could not connect to the server.");
            } finally {
                // Sets loading to false after the fetch attempt is complete.
                setLoading(false);
            }
        }
        fetchSlots();
    // The dependency array [ownerId] ensures this effect re-runs if the ownerId changes.
    }, [ownerId]);

    // Helper function to format an ISO date string into a more readable format (e.g., "July 20, 2024").
    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Helper function to format an ISO date string into a time format (e.g., "10:30 AM").
    const formatTime = (isoString) => {
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Handles the action of booking a slot.
    async function handleBookSlot(slot) {
        // Simulates a booking confirmation. In a real app, this would involve an API call.
        if (slot.slot_type === "office_hours") {
            try {
                const response = await fetch(`http://winter2026-comp307-group15.cs.mcgill.ca:5000/api/slots/${slot.slot_id}/reserve`, {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to update request');
                }
            } catch(err) {
                console.error("Error updating request", err);
                window.alert(`Error updating request: ${err.message}`);
    
            }
        } else {
            try {
                const response = await fetch(`http://winter2026-comp307-group15.cs.mcgill.ca:5000/api/slots/group/${slot.slot_id}/vote`, {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to update request');
                }
            }
            catch(err) {
                console.error("Error updating request", err);
                window.alert(`Error updating request: ${err.message}`);
    
            }
            
        }
    
        alert(`You have booked slot ${slot.slot_id}. A confirmation email has been sent.`);
        // Updates the UI immediately to reflect the booking by changing the slot's state.
        setSlots(prevSlots => prevSlots.map(slot =>
            slot.slot_id === slotId ? { ...slot, isBooked: true } : slot
        ));
    };

    return (
        <main>
            {/* Navigation bar with a logo, dashboard link, and log out button. */}
            <div className="navBar" id="navBar">
                <div>
                    <img src="/mcbooking.png" alt="mcbooking logo" />
                </div>
                <div className="menu">
                    <a href="/dashboard" id="dashboard">Dashboard</a>
                    <button id="exit" onClick={() => navigate('/')}>Log Out</button>
                </div>
            </div>

            {/* Main content area for displaying available slots. */}
            <h1>Available Slots for {ownerName}</h1>
            <div id="bookingList">
                {loading && <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading slots...</p>}
                {error && <p style={{ textAlign: 'center', marginTop: '2rem', color: 'red' }}>{error}</p>}
                {!loading && !error && slots.length === 0 && (
                    <p style={{ textAlign: 'center', marginTop: '2rem' }}>No active slots currently available.</p>
                )}
                {slots.map((slot) => (
                    <div className="card" key={slot.slot_id}>
                        <div className="header-line">
                            <h3>{slot.slot_title}</h3>
                        </div>
                        <p>Date: {formatDate(slot.start_time)}</p>
                        <p>Time: {formatTime(slot.start_time)} - {formatTime(slot.end_time)}</p>
                        {/* Renders a disabled "Booked" button if the slot is already booked, otherwise a "Book Now" button. */}
                        {slot.isBooked ? (
                            <button disabled>Booked</button>
                        ) : (
                            <button onClick={() => handleBookSlot(slot)}>Book Now</button>
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
}

// Exports the component for use in other parts of the application.
export default BookingPage;
