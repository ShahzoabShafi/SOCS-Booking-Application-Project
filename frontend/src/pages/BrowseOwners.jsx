// hooks from react
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../Dashboard.css';

// Miguel Angel Vargas Valenica
// display a list of active slot owners and allows the user to navigate to a booking page for a selected owner.
//latest version


function BrowseOwners() {
    const navigate = useNavigate();
    // State to store the list of owners.
    const [owners, setOwners] = useState([]);
    // State to manage the loading status.
    const [loading, setLoading] = useState(true);
    // State to store any potential errors.
    const [error, setError] = useState(null);

    // This useEffect hook fetches the list of slot owners from the API when the component mounts.
    useEffect(() => {
        async function fetchOwners() {
            try {
                const response = await fetch('http://winter2026-comp307-group15.cs.mcgill.ca:5000/api/slots/get_slot_owners', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const data = await response.json();
                if (response.ok && data.slot_owners) {
                    setOwners(data.slot_owners);
                } else {
                    setError(data.message || "Failed to fetch owners.");
                }
            } catch (error) {
                // Catches network or other errors during the fetch and sets a connection error message.
                setError("Could not connect to the server.");
            } finally {
                setLoading(false);
            }
        }
        fetchOwners();
    }, []);

    const handleOwnerClick = (owner) => {
        navigate(`/booking/${owner.user_id}`, { state: { ownerName: owner.name } });
    };

    return (
        <main>
            <div className="navBar" id="navBar">
                <div>
                    <img src="/mcbooking.png" alt="mcbooking logo" style={{ cursor: "pointer" }} onClick={() => navigate('/dashboard')} />
                </div>
                <div className="menu">
                    <a href="/dashboard" id="dashboard">Dashboard</a>
                    <button id="exit" onClick={() => navigate('/')}>Log Out</button>
                </div>
            </div>

            <h1>Browse Owners</h1>
            <div id="bookingList">
                {/* we display a loading message while data is being fetched. */}

                {loading && <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading owners...</p>}
                {/* Display an error message if an error occurred. */}
                {error && <p style={{ textAlign: 'center', marginTop: '2rem', color: 'red' }}>{error}</p>}
                {/* Display a message if no owners are found. */}

                {!loading && !error && owners.length === 0 && (

                    <p style={{ textAlign: 'center', marginTop: '2rem' }}>No owners found.</p>
                )}
                {/* Map over the owners array and render a card for each owner. */}
                {owners
                
                .map((owner) => (
                    <div className="card" key={owner.user_id} onClick={() => handleOwnerClick(owner)} style={{ cursor: 'pointer' }}>
                        <div className="header-line">
                            <h3>{owner.name}</h3>
                        </div>
                        <p>{owner.email}</p>
                        <p>Click to see available slots</p>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default BrowseOwners;