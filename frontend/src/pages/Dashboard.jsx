import React, { useState, useEffect } from "react";
import '../Dashboard.css';
import { useNavigate } from 'react-router-dom';

//author: Marie Lefevre

function Dashboard() {
    const [bookings, setBookings] = useState([]);
    const [requests, setRequests] = useState([]);
    const [user, setUser] = useState(null);

    async function loadUser() {
        try {
            const userJson= localStorage.getItem('user');
            if (userJson) {
                setUser(JSON.parse(userJson));
            } else {
                handleLogout();
            }
        } catch (err) {
            console.error("Error loading user:", err);
        }
    }

    function handleLogout() {
        navigate('/')
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    }

    useEffect(() => {
        loadUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function loadBookings() {
        try {
        const response = await fetch('http://winter2026-comp307-group15.cs.mcgill.ca:5000/api/confirmedBookings', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
            const data = await response.json();
            setBookings(Array.isArray(data.all_confirmed_bookings) ? data.all_confirmed_bookings : []);
        } catch (err) {
            console.error("Error loading bookings:", err);
        }
    }

    useEffect(() => {
        loadBookings();
    }, []);

    async function loadRequests() {
        try {
            const response = await fetch('http://winter2026-comp307-group15.cs.mcgill.ca:5000/api/bookings/requests', {
                method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
        const requestData = await response.json();
        setRequests(Array.isArray(requestData.pending_requests) ? requestData.pending_requests : []);

        } catch (err) {
            console.error("Error loading requested meetings:", err);
        }
    }

    useEffect(() => {
        if (user?.role === "owner") {
            loadRequests();
        }
        }, [user]);

    async function handleUpdate(id, status) {
        try {
            const response = await fetch(`/api/bookings/requests/${id}`, {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({id, status}),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update request');
            }
        } catch(err) {
            console.error("Error updating request", err);
        }
        
        await Promise.all([loadRequests(), loadBookings()]);
    }

    function handleDelete(id) {
        setBookings(prev =>
        prev.filter(booking => booking.id !== id)
        );
        fetch('/api/bookings/' + id, {
        method: 'DELETE'
        });
    }
    
    const navigate = useNavigate();

    return (
        <main>
            <div className="navBar" id="navBar">
                <div>
                    <img src="mcbooking.png" alt="mcbooking logo"></img>
                </div>
                <div className="menu">
                    <a href="/browse-owners" id="booking" > Book New </a>
                    <a href="/request" id="request" > Request a meeting </a>
                    <button id="exit" onClick={() => navigate('/')}> Log Out </button>

                    {/*check if user is owner; display owner features if yes. */}
                    {user?.role === "owner" && (
                    <>
                    <a href="/create" id="create"> Create New </a>
                    <a href="/" id="url"> Generate URL </a>
                </>
                )}
            </div>
            </div>
            {user?.role === "owner" && (
            <>
            <div id="requestList">
                <h1> Requested Appointments </h1>
                {requests.map((req, index) => (
                <div className="card" key={index}>
                    <div className="header-line">
                        <h3>{req.title}</h3>
                        <button onClick={() => handleUpdate(req.request_id, "declined")}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                        <path fill= "red" d="M262.2 48C248.9 48 236.9 56.3 232.2 68.8L216 112L120 112C106.7 112 96 122.7 96 136C96 149.3 106.7 160 120 160L520 160C533.3 160 544 149.3 544 136C544 122.7 533.3 112 520 112L424 112L407.8 68.8C403.1 56.3 391.2 48 377.8 48L262.2 48zM128 208L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 208L464 208L464 512C464 520.8 456.8 528 448 528L192 528C183.2 528 176 520.8 176 512L176 208L128 208zM288 280C288 266.7 277.3 256 264 256C250.7 256 240 266.7 240 280L240 456C240 469.3 250.7 480 264 480C277.3 480 288 469.3 288 456L288 280zM400 280C400 266.7 389.3 256 376 256C362.7 256 352 266.7 352 280L352 456C352 469.3 362.7 480 376 480C389.3 480 400 469.3 400 456L400 280z" />
                    </svg>
                        </button>
                        <button onClick={() => handleUpdate(req.request_id, "accepted")}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                        <path fill= "green" d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z"/>
                    </svg>
                        </button>
                    </div>
                    <div className="line">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" >
                            <path d="M224 64C241.7 64 256 78.3 256 96L256 128L384 128L384 96C384 78.3 398.3 64 416 64C433.7 64 448 78.3 448 96L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 96C192 78.3 206.3 64 224 64zM224 320C206.3 320 192 334.3 192 352L192 416C192 433.7 206.3 448 224 448L288 448C305.7 448 320 433.7 320 416L320 352C320 334.3 305.7 320 288 320L224 320z" />
                        </svg>
                        <p>Date: {String(req.start_time).split('T')[0]}</p>
                    </div>
                    <div className="line">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                            <path d="M160 64C142.3 64 128 78.3 128 96C128 113.7 142.3 128 160 128L160 139C160 181.4 176.9 222.1 206.9 252.1L274.8 320L206.9 387.9C176.9 417.9 160 458.6 160 501L160 512C142.3 512 128 526.3 128 544C128 561.7 142.3 576 160 576L480 576C497.7 576 512 561.7 512 544C512 526.3 497.7 512 480 512L480 501C480 458.6 463.1 417.9 433.1 387.9L365.2 320L433.1 252.1C463.1 222.1 480 181.4 480 139L480 128C497.7 128 512 113.7 512 96C512 78.3 497.7 64 480 64L160 64zM416 501L416 512L224 512L224 501C224 475.5 234.1 451.1 252.1 433.1L320 365.2L387.9 433.1C405.9 451.1 416 475.5 416 501z" />
                        </svg>
                        <p>Time: {String(req.start_time).split('T')[1]} - {String(req.end_time).split('T')[1]} </p>
                    </div>
                    <p> Message: {req.message} </p>
                    <p>Attendee(s): {req.name} ({req.email})</p>
                </div>
                ))}
            </div>
        </>
        )}
        <h1> Upcoming Appointments </h1>
        <div id="bookingList">
            {bookings.map((booking, index) => (
            <div className="card" key={index}>
                <div className="header-line">
                    <h3>{booking.slot_title}</h3>
                    <button onClick={() => handleDelete(booking.id)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <path d="M262.2 48C248.9 48 236.9 56.3 232.2 68.8L216 112L120 112C106.7 112 96 122.7 96 136C96 149.3 106.7 160 120 160L520 160C533.3 160 544 149.3 544 136C544 122.7 533.3 112 520 112L424 112L407.8 68.8C403.1 56.3 391.2 48 377.8 48L262.2 48zM128 208L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 208L464 208L464 512C464 520.8 456.8 528 448 528L192 528C183.2 528 176 520.8 176 512L176 208L128 208zM288 280C288 266.7 277.3 256 264 256C250.7 256 240 266.7 240 280L240 456C240 469.3 250.7 480 264 480C277.3 480 288 469.3 288 456L288 280zM400 280C400 266.7 389.3 256 376 256C362.7 256 352 266.7 352 280L352 456C352 469.3 362.7 480 376 480C389.3 480 400 469.3 400 456L400 280z" />
                </svg>
                    </button>
                </div>
                <div className="line">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                        <path d="M224 64C241.7 64 256 78.3 256 96L256 128L384 128L384 96C384 78.3 398.3 64 416 64C433.7 64 448 78.3 448 96L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 96C192 78.3 206.3 64 224 64zM224 320C206.3 320 192 334.3 192 352L192 416C192 433.7 206.3 448 224 448L288 448C305.7 448 320 433.7 320 416L320 352C320 334.3 305.7 320 288 320L224 320z" />
                    </svg>
                    <p>Date: {String(booking.start_time).split('T')[0]}</p>
                </div>
                <div className="line">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                        <path d="M160 64C142.3 64 128 78.3 128 96C128 113.7 142.3 128 160 128L160 139C160 181.4 176.9 222.1 206.9 252.1L274.8 320L206.9 387.9C176.9 417.9 160 458.6 160 501L160 512C142.3 512 128 526.3 128 544C128 561.7 142.3 576 160 576L480 576C497.7 576 512 561.7 512 544C512 526.3 497.7 512 480 512L480 501C480 458.6 463.1 417.9 433.1 387.9L365.2 320L433.1 252.1C463.1 222.1 480 181.4 480 139L480 128C497.7 128 512 113.7 512 96C512 78.3 497.7 64 480 64L160 64zM416 501L416 512L224 512L224 501C224 475.5 234.1 451.1 252.1 433.1L320 365.2L387.9 433.1C405.9 451.1 416 475.5 416 501z" />
                    </svg>
                    <p>Time: {String(booking.start_time).split('T')[1]} - {String(booking.end_time).split('T')[1]} </p>
                </div>
                <p>Type: {booking.slot_type}</p>
            </div>
            ))}
        </div>
        </main>
    )
    }
    export default Dashboard;