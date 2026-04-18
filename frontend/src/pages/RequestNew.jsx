import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../Forms.css';
import '../Dashboard.css';

//Marie Lefevre


function RequestNew() {
    const [owners, setOwners] = useState([]);
    const [owner_email, setOwnerEmail] = useState('');
    const [title, setTitle] = useState('');
    const [start_time, setStart] = useState('');
    const [end_time, setEnd] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
            async function fetchAllOwners() {
                try {
                    //FILL IN THE API ONCE I GET IT 
                    const response = await fetch('http://winter2026-comp307-group15.cs.mcgill.ca:5000/api/slots/', {
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
            fetchAllOwners();
        }, []);

    const handleRequest = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://winter2026-comp307-group15.cs.mcgill.ca:5000/api/bookings/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ owner_email, start_time, end_time, title, message }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to create meeting request');
            }
            window.alert("Meeting request sent.");
            navigate('/dashboard');
        } catch (err) {
            console.error("Error requesting a meeting:", err);
            window.alert(`Error requesting a meeting: ${err.message}`);
        }
    };

    return (
        <main>
            <div className="navBar">
                <div>
                    <img src="/mcbooking.png" alt=""></img>
                </div>
                <div className="menu">
                    <a href="/dashboard" id="back"> Back </a>
                    <a href="/" id="exit"> Log Out </a>
                </div>
            </div>
            <div className="form-container">
                <form name="Request" onSubmit={handleRequest}>
                    <h1> Request a Meeting </h1>
                    <select
                        name="owner"
                        value={owner_email}
                        onChange={(e) => setOwnerEmail(e.target.value)}
                        required
                        >
                        <option value="">Select an owner</option>

                        {owners.map((owner, index) => (
                            <option key={index} value={owner.email}>
                            {owner.name ? `${owner.name} (${owner.email})` : owner.email}
                            </option>
                        ))}
                        </select> <br />

                    <input type="text" name="title" placeholder="*Topic" 
                           value={title}
                           onChange={(e) => setTitle(e.target.value)}
                           required /> <br />

                    <label htmlFor="Date">Start Date: </label>
                    <input type="datetime-local" name="start_time" id="Date" 
                           value={start_time}
                           onChange={(e) => setStart(e.target.value)}
                           required /> <br />
                    
                    <label htmlFor="date2">End Date: </label>
                    <input type="datetime-local" name="end_time" id="date2" 
                           value={end_time}
                           onChange={(e) => setEnd(e.target.value)}
                           required /> <br />
                    
                    <textarea name="message" placeholder="Message" rows="4" cols="40" 
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              required /> <br />
                
                    <input type="submit" value="Submit" />
                </form>
            </div>
        </main>
    );
}

export default RequestNew;