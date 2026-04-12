import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../Forms.css';
import '../Dashboard.css';

//Marie Lefevre


function RequestNew() {
    const [owner, setOwner] = useState('');
    const [title, setTitle] = useState('');
    const [start_time, setStart] = useState('');
    const [end_time, setEnd] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleRequest = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://winter2026-comp307-group15.cs.mcgill.ca:5000/api/bookings/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ owner, start_time, end_time, title, message }),
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
                    <input type="email" name="owner" placeholder="With: enter their mcgill.ca email address" 
                           value={owner}
                           onChange={(e) => setOwner(e.target.value)}
                           required /> <br />

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