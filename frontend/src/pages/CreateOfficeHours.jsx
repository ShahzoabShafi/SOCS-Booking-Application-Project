import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Forms.css';
import '../Dashboard.css';

//Marie Lefevre 

const CreateOfficeHours = () => {
    const [title, setTitle] = useState('');
    const [day, setDay] = useState('');
    const [start_date, setStartDate] = useState('');
    const [start_time, setStart] = useState('');
    const [end_time, setEnd] = useState('');
    const [number_weeks_recurrence, setNumberWeeksRecurrence] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://winter2026-comp307-group15.cs.mcgill.ca:5000/api/slots/recurring', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    "title": title,
                    "dayOfWeek": day,
                    "startTime": start_time,
                    "endTime": end_time,
                    "startingDate": start_date,
                    "weeks": Number(number_weeks_recurrence)
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to create group');
            }
            alert("OH created.");
            navigate('/dashboard');
        } catch (err) {
            console.error("Error creating office hours:", err);
            alert(`Error creating office hours: ${err.message}`);
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
                    <form onSubmit={handleSubmit}>
                    <h2 style={{ textAlign: "center", marginTop: "1.5rem" }}>Create Office Hours</h2>
                    <br />
                        <label htmlFor="title">Title: </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        /> <br />
                        <label htmlFor="day">Day of the week:</label>
                        <input
                            type="text"
                            placeholder="Monday, Tuesday, etc."
                            id="day"
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            required
                        /> <br />

                        <label htmlFor="time">Starting Time: </label>
                        <input
                            type="time" name="start_time" id="time"
                            value={start_time}
                            onChange={(e) => setStart(e.target.value)}
                            required
                        /> <br />

                        <label htmlFor="date2">End Time: </label>
                        <input
                            type="time" name="end_time" id="date2"
                            value={end_time}
                            onChange={(e) => setEnd(e.target.value)}
                            required
                        /> <br />

                        <label htmlFor="Date">Choose the date of your first office hours: </label>
                        <input
                            type="date" name="start_date" id="Date"
                            value={start_date}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        /> <br />

                        <label htmlFor="number_weeks_recurrence">How many weeks should the meeting recur?</label>
                        <input
                            type="number"
                            id="number_weeks_recurrence"
                            value={number_weeks_recurrence}
                            onChange={(e) => setNumberWeeksRecurrence(e.target.value)}
                            required
                        />
                        <br />
                        <button type="submit" className="submit-btn">Create Office Hours</button>
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
            form button.submit-btn {
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
            form button.submit-btn:hover {
                background-color: #1a3a6b;
            }
        `}</style>
            </main>
        </>
    );
};

export default CreateOfficeHours;
