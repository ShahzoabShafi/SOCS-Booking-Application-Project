import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../Dashboard.css';

// Miguel Angel Vargas Valenica

function BrowseOwners() {
    const navigate = useNavigate();
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchOwners() {
            try {
                const response = await fetch('http://winter2026-comp307-group15.cs.mcgill.ca:5000/api/slots/get_slot_owners');
                const data = await response.json();
                if (response.ok && data.slot_owners) {
                    setOwners(data.slot_owners);
                } else {
                    setError(data.message || "Failed to fetch owners.");
                }
            } catch (error) {
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
                    <img src="/mcbooking.png" alt="mcbooking logo" />
                </div>
                <div className="menu">
                    <a href="/dashboard" id="dashboard">Dashboard</a>
                    <button id="exit" onClick={() => navigate('/')}>Log Out</button>
                </div>
            </div>

            <h1>Browse Owners</h1>
            <div id="bookingList">
                {loading && <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading owners...</p>}
                {error && <p style={{ textAlign: 'center', marginTop: '2rem', color: 'red' }}>{error}</p>}
                {!loading && !error && owners.length === 0 && (
                    <p style={{ textAlign: 'center', marginTop: '2rem' }}>No owners found.</p>
                )}
                {owners.map((owner) => (
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