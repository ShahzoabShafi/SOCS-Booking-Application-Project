import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Forms.css';

const CreateGroup = () => {
    const [title, setTitle] = useState('');
    const [start_time1, setStart1] = useState('');
    const [end_time1, setEnd1] = useState('');
    const [start_time2, setStart2] = useState('');
    const [end_time2, setEnd2] = useState('');
    const [start_time3, setStart3] = useState('');
    const [end_time3, setEnd3] = useState('');
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
                body: JSON.stringify({ "slots": [
                    {"slot_title": title, "start_time": start_time1, "end_time": end_time1, "number_weeks_recurrence": number_weeks_recurrence}, 
                    {"slot_title": title, "start_time": start_time2, "end_time": end_time2, "number_weeks_recurrence": number_weeks_recurrence}, 
                    {"slot_title": title, "start_time": start_time3, "end_time": end_time3, "number_weeks_recurrence": number_weeks_recurrence}
                ]})
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to create group');
            }
            window.alert("Group meeting created.");
            navigate('/dashboard');
        } catch (err) {
            console.error("Error creating group meeting:", err);
            window.alert(`Error creating group meeting: ${err.message}`);
        }
    };

    return (
        <div className="form-container">
            <h2>Create New Group Meeting</h2> <br />
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title: </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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
                <h3>Suggest 3 meeting times for the group.</h3>
                <label htmlFor="Date">Start Date: </label>
                <input type="datetime-local" name="start_time1" id="Date" 
                        value={start_time1}
                        onChange={(e) => setStart1(e.target.value)}
                        required /> <br />
        
                <label htmlFor="date2">End Date: </label>
                    <input type="datetime-local" name="end_time1" id="date2" 
                        value={end_time1}
                        onChange={(e) => setEnd1(e.target.value)}
                        required /> <br />
                        
                <p> Second option:</p>
                <label htmlFor="Date">Start Date: </label>
                <input type="datetime-local" name="start_time2" id="Date" 
                        value={start_time2}
                        onChange={(e) => setStart2(e.target.value)}
                        required /> <br />
        
                <label htmlFor="date2">End Date: </label>
                    <input type="datetime-local" name="end_time2" id="date2" 
                        value={end_time2}
                        onChange={(e) => setEnd2(e.target.value)}
                        required /> <br />
                
                <p> Third option:</p>
                <label htmlFor="Date">Start Date: </label>
                <input type="datetime-local" name="start_time3" id="Date" 
                        value={start_time3}
                        onChange={(e) => setStart3(e.target.value)}
                        required /> <br />
        
                <label htmlFor="date2">End Date: </label>
                    <input type="datetime-local" name="end_time3" id="date2" 
                        value={end_time3}
                        onChange={(e) => setEnd3(e.target.value)}
                        required /> <br />
                
                <br />
                <button type="submit" className="submit-btn">Create Group</button>
            </form>
        </div>
    );
};

export default CreateGroup;
