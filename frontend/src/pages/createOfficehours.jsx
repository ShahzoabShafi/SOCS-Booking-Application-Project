import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Forms.css';

const CreateOfficeHours = () => {
    const [title, setTitle] = useState('');
    const [day, setDay] = useState('');
    const [time, setTime] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission, e.g., send data to a server.
        console.log({ title, day, time, description });
        alert('Office hours created successfully!');
        navigate('/dashboard'); // Redirect after creation
    };

    return (
        <div className="form-container">
            <h2>Create Office Hours</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="day">Day</label>
                    <input
                        type="date"
                        id="day"
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="time">Time</label>
                    <input
                        type="time"
                        id="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button type="submit" className="submit-btn">Create Office Hours</button>
            </form>
        </div>
    );
};

export default CreateOfficeHours;
