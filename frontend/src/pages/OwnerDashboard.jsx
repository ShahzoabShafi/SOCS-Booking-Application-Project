import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../Dashboard.css';

//Miguel Angel Vargas Valencia

function OwnerDashboard() {
    const navigate = useNavigate();
    const [slots, setSlots] = useState([]);
    const [requests, setRequests] = useState([]);
    const [inviteUrl, setInviteUrl] = useState('');

    // Removed user loading logic for dummy data display

    async function loadSlots() {
        try {
            const response = await fetch('/slots.json');
            const data = await response.json();
            setSlots(data);
        } catch (err) {
            console.error("Error loading slots:", err);
        }
    }

    async function loadRequests() {
        try {
            const response = await fetch('/requests.json');
            const requestData = await response.json();
            setRequests(requestData);
        } catch (err) {
            console.error("Error loading requested meetings:", err);
        }
    }

    useEffect(() => {
        // Load data directly for the dummy data display
        loadSlots();
        loadRequests();
    }, []); // The empty array ensures this runs only once on mount

    async function handleAccept(id) {
        // This function will need to be fully implemented with a real backend
        console.log(`Accepted request ${id}`);
        // To simulate the change, we can filter out the accepted request
        setRequests(requests.filter(req => req.id !== id));
    }

    async function handleDecline(id) {
        // This function will need to be fully implemented with a real backend
        console.log(`Declined request ${id}`);
        setRequests(requests.filter(req => req.id !== id));
    }

    async function handleActivate(id) {
        // This function will need to be fully implemented with a real backend
        console.log(`Activated slot ${id}`);
        // To simulate the change, we can update the status
        setSlots(slots.map(slot => slot.id === id ? { ...slot, status: 'active' } : slot));
    }

    async function handleDelete(id) {
        // This function will need to be fully implemented with a real backend
        console.log(`Deleted slot ${id}`);
        setSlots(slots.filter(slot => slot.id !== id));
    }
    
    function generateInviteUrl() {
        // Using a dummy ID for the invite URL generation
        const dummyOwnerId = 'dummy-owner-123';
        const url = `${window.location.origin}/booking/${dummyOwnerId}`;
        setInviteUrl(url);
    }

    return (
        <main>
            <div className="navBar" id="navBar">
                <div>
                    <img src="/mcbooking.png" alt="mcbooking logo"></img>
                </div>
                <div className="menu">
                    <a href="/create-new" id="create"> Create New Slot </a>
                    <button id="exit" onClick={() => navigate('/')}> Log Out </button>
                </div>
            </div>

            <div id="requests">
                <h1> Requested Appointments </h1>
                {requests.map((req, index) => (
                    <div className="card" key={index}>
                        <div className="header-line">
                            <h3>{req.title}</h3>
                            <button onClick={() => handleDecline(req.id)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path d="M262.2 48C248.9 48 236.9 56.3 232.2 68.8L216 112L120 112C106.7 112 96 122.7 96 136C96 149.3 106.7 160 120 160L520 160C533.3 160 544 149.3 544 136C544 122.7 533.3 112 520 112L424 112L407.8 68.8C403.1 56.3 391.2 48 377.8 48L262.2 48zM128 208L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 208L464 208L464 512C464 520.8 456.8 528 448 528L192 528C183.2 528 176 520.8 176 512L176 208L128 208zM288 280C288 266.7 277.3 256 264 256C250.7 256 240 266.7 240 280L240 456C240 469.3 250.7 480 264 480C277.3 480 288 469.3 288 456L288 280zM400 280C400 266.7 389.3 256 376 256C362.7 256 352 266.7 352 280L352 456C352 469.3 362.7 480 376 480C389.3 480 400 469.3 400 456L400 280z" />
                            </svg>
                            </button>
                            <button onClick={() => handleAccept(req.id)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z"/>
                            </svg>
                            </button>
                        </div>
                        <p>Date: {req.date}</p>
                        <p>Time: {req.startTime} - {req.endTime} </p>
                        <p> Message: {req.message} </p>
                        <p>Attendee(s): {req.user}</p>
                    </div>
                ))}
            </div>
            
            <h1> My Time Slots </h1>
            <button onClick={generateInviteUrl} id="url"> Generate Invite URL </button>
            {inviteUrl && <p>Your invite URL is: <a href={inviteUrl}>{inviteUrl}</a></p>}

            <div id="slotList">
                {slots.map((slot, index) => (
                    <div className="card" key={index}>
                        <div className="header-line">
                            <h3>{slot.title}</h3>
                            <div>
                                {slot.status === 'private' && <button onClick={() => handleActivate(slot.id)}>Activate</button>}
                                <button onClick={() => handleDelete(slot.id)}>Delete</button>
                            </div>
                        </div>
                        <p>Date: {slot.date}</p>
                        <p>Time: {slot.startTime} - {slot.endTime} </p>
                        <p>Status: {slot.status}</p>
                        {slot.status === 'booked' && <p>Booked by: {slot.booker}</p>}
                    </div>
                ))}
            </div>
        </main>
    )
}

export default OwnerDashboard;
