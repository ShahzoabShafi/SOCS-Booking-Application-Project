import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../Forms.css';
import '../Dashboard.css';

// author: Marie Lefevre


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
                const response = await fetch('http://winter2026-comp307-group15.cs.mcgill.ca:5000/api/bookings/request/owners', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const data = await response.json();
                if (response.ok && data.owners) {
                    setOwners(data.owners);
                }
            } catch (err) {
                console.error("Error finalizing", err);
                window.alert(`Error loading owners: ${err.message}`);
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
        <>
            <div className="navBar" id="navBar">
                <div>
                    <img src="/mcbooking.png" alt="mcbooking logo" style={{ cursor: "pointer" }} onClick={() => navigate('/dashboard')} />
                </div>
                <div className="menu">
                    <button onClick={() => navigate(-1)}> Back </button>
                    <button id="exit" onClick={() => {
                        navigate('/');
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                    }}> Log Out </button>
                </div>
            </div>
            <main>
                <div className="form-container">
                    <form name="Request" onSubmit={handleRequest}>
                        <h2 style={{ textAlign: "center", marginTop: "1.5rem" }}> Request a Meeting </h2>
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

                        <label htmlFor="title">Topic </label>
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

                <style>{`
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 0.35rem;     
                }
                form br {
                    display: none;     
                }
                form h1 {
                    margin-bottom: 1rem;
                }
                form label {
                    font-weight: 500;
                    color: #374151;
                    font-size: 0.95rem;
                    margin-top: 0.5rem;
                }
                form input, 
                form select, 
                form textarea {
                    padding: 0.75rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    font-family: inherit;
                    width: 100%;
                    box-sizing: border-box;
                    background-color: #f9fafb;
                }
                form input:focus, 
                form select:focus, 
                form textarea:focus {
                    outline: none;
                    border-color: #81acfc;
                    background-color: white;
                    box-shadow: 0 0 0 2px rgba(129, 172, 252, 0.2);
                }
                form input[type="submit"] {
                    padding: 0.85rem;
                    background-color: #81acfc;
                    color: white;
                    border: none;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 1rem;
                    transition: background-color 0.2s;
                }
                form input[type="submit"]:hover {
                    background-color: #1a3a6b;
                }
            `}</style>
            </main>
        </>
    );
}

export default RequestNew;