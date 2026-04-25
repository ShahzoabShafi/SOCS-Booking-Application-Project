import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Forms.css';
import '../Dashboard.css';

//Marie Lefevre

const CreateGroup = () => {
    const [title, setTitle] = useState('');
    const [timeSlots, setTimeSlots] = useState([
        { start_time: "", end_time: "" }
    ]);
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
                        <h2>Create New Group Meeting</h2> <br />
                        <label htmlFor="title">Title: </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        /> <br />

                        <h3>Suggest meeting times for the group.</h3>
                        {timeSlots.map((slot, index) => (
                            <div key={index} className="time-pair">
                                <h3>Option:</h3>
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

                <style>{`
            form { display: flex; flex-direction: column; gap: 0.5rem; }
            form br { display: none; }
            form h2, form h3 { margin: 0.2rem 0; }
            form label { font-weight: 500; font-size: 0.95rem; }
            form input { width: 100%; box-sizing: border-box; }
            form input:focus { outline: none; border-color: #81acfc; box-shadow: 0 0 4px #81acfc; }
            form button.submit-btn { margin-top: 1rem; }
            form button[type="button"] { 
                background: transparent; color: #81acfc; 
                border: 1px dashed #81acfc; margin-top: 0.5rem; 
            }
            form button[type="button"]:hover { background: #e4eaf5; }
            .time-pair { background: #f9fafb; padding: 1rem; border-radius: 8px; border: 1px solid #e5e7eb; }
            .time-pair input { margin-bottom: 0.5rem; }
            .time-pair h3 { margin-top: 0; }
        `}</style>
            </main>
        </>
    );
};

export default CreateGroup;
