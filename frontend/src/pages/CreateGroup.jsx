import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Forms.css';

//Marie Lefevre

const CreateGroup = () => {
    const [title, setTitle] = useState('');
    const [timeSlots, setTimeSlots] = useState([
        { start_time: "", end_time: "" }
      ]);
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
                    "recurrence": number_weeks_recurrence,
                    "slots": timeSlots
                  })
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
    const addTimeSlot = () => {
        setTimeSlots([...timeSlots, { start_time: "", end_time: "" }]);
      };

    const handleTimeChange = (index, field, value) => {
        const updated = [...timeSlots];
        updated[index][field] = value;
        setTimeSlots(updated);
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
                <h3>Suggest meeting times for the group.</h3>
                {timeSlots.map((slot, index) => (
                    <div key={index} className="time-pair">
                        <input
                        type="datetime-local"
                        value={slot.start_time}
                        onChange={(e) =>
                            handleTimeChange(index, "start_time", e.target.value)
                        }
                        required
                        />
                        <br />
                        <input
                        type="datetime-local"
                        value={slot.end_time}
                        onChange={(e) =>
                            handleTimeChange(index, "end_time", e.target.value)
                        }
                        required
                        /> <br />
                    </div>
                    ))}             
                    <button type="button" onClick={addTimeSlot}>
                    ➕ Add another time
                    </button> <br />
                <button type="submit" className="submit-btn">Create Group</button>
            </form>
        </div>
    );
};

export default CreateGroup;
