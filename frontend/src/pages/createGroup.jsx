import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Forms.css';

const CreateGroup = () => {
    const [groupName, setGroupName] = useState('');
    const [members, setMembers] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically handle form submission,
        // like sending the data to a server.
        console.log({ groupName, members, description });
        alert('Group created successfully!');
        navigate('/dashboard'); // Redirect to dashboard or another appropriate page
    };

    return (
        <div className="form-container">
            <h2>Create New Group</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="groupName">Group Name</label>
                    <input
                        type="text"
                        id="groupName"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="members">Members (comma-separated emails)</label>
                    <input
                        type="text"
                        id="members"
                        value={members}
                        onChange={(e) => setMembers(e.target.value)}
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
                <button type="submit" className="submit-btn">Create Group</button>
            </form>
        </div>
    );
};

export default CreateGroup;
