
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../Dashboard.css';

// Miguel Angel Vargas Valenica
//comment
function BrowseOwners() {
    const navigate = useNavigate();
    const [owners, setOwners] = useState([]);

    // Mock data for owners - replace with API call
    useEffect(() => {
        const mockOwners = [
            { id: 1, name: "Professor V" },
            { id: 2, name: "Professor M" },
            { id: 3, name: "Professor A" }
        ];
        setOwners(mockOwners);
    }, []);

    const handleOwnerClick = (ownerId) => {
        navigate(`/booking/${ownerId}`);
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

            <h1>Browse Owners</h1>
            <div id="bookingList">
                {owners.map((owner) => (
                    <div className="card" key={owner.id} onClick={() => handleOwnerClick(owner.id)} style={{cursor: 'pointer'}}>
                        <div className="header-line">
                            <h3>{owner.name}</h3>
                        </div>
                        <p>Click to see available slots</p>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default BrowseOwners;
