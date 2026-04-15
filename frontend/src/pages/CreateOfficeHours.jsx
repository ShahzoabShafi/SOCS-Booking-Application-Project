import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Forms.css';

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
            const response = await fetch('http://winter2026-comp307-group15.cs.mcgill.ca:5000/api/slots/group', {
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
                    "weeks": number_weeks_recurrence
                })
            });
            console.log("RESPONSE:", response);
            const data = await response.json();
            console.log({ title, day, start_time, end_time, start_date, number_weeks_recurrence});
            const text = await response.text();
            console.log("RAW RESPONSE:", text);
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
        <div className="form-container">
            <h2>Create Office Hours</h2> 
            <br />
            <form onSubmit={handleSubmit}>
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

                <label htmlFor="Date">Starting Date: </label>
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
    );
};

export default CreateOfficeHours;
