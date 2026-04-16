import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../Dashboard.css';
//Marie Lefevre

function Slots() {
    const navigate = useNavigate();
    const [slots, setSlots] = useState([]);
    const [user, setUser] = useState(null);

    async function loadUser() {
        try {
            const userJson = localStorage.getItem('user');
            if (userJson) {
                setUser(JSON.parse(userJson));
            } else {
                // handleLogout(); // This was causing the redirect
            }
        } catch (err) {
            console.error("Error loading user:", err);
        }
    }
    async function loadSlots() {
        try {
            const response = await fetch('http://winter2026-comp307-group15.cs.mcgill.ca:5000/api/slots/all', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await response.json();
            console.log("DATA:", data)
            setSlots(Array.isArray(data.my_slots) ? data.my_slots : []);
        } catch (err) {
            console.error("Error loading slots:", err);
            window.alert(`Error loading slots: ${err.message}`);
        }
    }

    useEffect(() => {
        loadSlots();
    }, []);

    async function handleDelete(id) {
        try {
            const response = await fetch(`http://winter2026-comp307-group15.cs.mcgill.ca:5000/api/slots/${id}/delete`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ "slot_id": id })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete');
            }
        } catch (err) {
            console.error("Error deleting slot", err);
        }
        await Promise.all([loadSlots()]);
    }

    async function handleActivate(id) {
        try {
            const response = await fetch(`http://winter2026-comp307-group15.cs.mcgill.ca:5000/api/slots/${id}/activate`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ "slot_id": id })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to activate');
            }
        } catch (err) {
            console.error("Error activating slot", err);
        }
    }
    function handleLogout() {
        navigate('/')
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    }

    return (
        <main>
            <div className="navBar" id="navBar">
                <div>
                    <img src="/mcbooking.png" alt="mcbooking logo"></img>
                </div>
                <div className="menu">
                    <a href="/browse-owners" id="booking" > Book New </a>
                    <button id="exit" onClick={() => handleLogout()}> Log Out </button>
                </div>
            </div>
            <h1> My slots </h1>
            
            <div id="slotList">
                {slots.map((slot, index) => (
                    <div className="card" key={index}>
                        <div className="header-line">
                            <h3>{slot.slot_title}</h3>
                            <button onClick={() => handleDelete(slot.slot_id)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path fill="red" d="M262.2 48C248.9 48 236.9 56.3 232.2 68.8L216 112L120 112C106.7 112 96 122.7 96 136C96 149.3 106.7 160 120 160L520 160C533.3 160 544 149.3 544 136C544 122.7 533.3 112 520 112L424 112L407.8 68.8C403.1 56.3 391.2 48 377.8 48L262.2 48zM128 208L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 208L464 208L464 512C464 520.8 456.8 528 448 528L192 528C183.2 528 176 520.8 176 512L176 208L128 208zM288 280C288 266.7 277.3 256 264 256C250.7 256 240 266.7 240 280L240 456C240 469.3 250.7 480 264 480C277.3 480 288 469.3 288 456L288 280zM400 280C400 266.7 389.3 256 376 256C362.7 256 352 266.7 352 280L352 456C352 469.3 362.7 480 376 480C389.3 480 400 469.3 400 456L400 280z" />
                            </svg>
                            </button>

                            {/* CHANGE THIS TO A BADGE SHOWING ACTIVATION STATUS */}
                            <button onClick={() => handleActivate(slot.slot_id)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path fill="red" d="M125.4 128C91.5 128 64 155.5 64 189.4C64 190.3 64 191.1 64.1 192L64 192L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 192L575.9 192C575.9 191.1 576 190.3 576 189.4C576 155.5 548.5 128 514.6 128L125.4 128zM528 256.3L528 448C528 456.8 520.8 464 512 464L128 464C119.2 464 112 456.8 112 448L112 256.3L266.8 373.7C298.2 397.6 341.7 397.6 373.2 373.7L528 256.3zM112 189.4C112 182 118 176 125.4 176L514.6 176C522 176 528 182 528 189.4C528 193.6 526 197.6 522.7 200.1L344.2 335.5C329.9 346.3 310.1 346.3 295.8 335.5L117.3 200.1C114 197.6 112 193.6 112 189.4z" />
                            </svg>
                            </button>
                        </div>
                        <div className="line">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path d="M224 64C241.7 64 256 78.3 256 96L256 128L384 128L384 96C384 78.3 398.3 64 416 64C433.7 64 448 78.3 448 96L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 96C192 78.3 206.3 64 224 64zM224 320C206.3 320 192 334.3 192 352L192 416C192 433.7 206.3 448 224 448L288 448C305.7 448 320 433.7 320 416L320 352C320 334.3 305.7 320 288 320L224 320z" />
                            </svg>
                            <p>Date: {String(slot.start_time).split('T')[0]}</p>
                        </div>
                        <div className="line">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path d="M160 64C142.3 64 128 78.3 128 96C128 113.7 142.3 128 160 128L160 139C160 181.4 176.9 222.1 206.9 252.1L274.8 320L206.9 387.9C176.9 417.9 160 458.6 160 501L160 512C142.3 512 128 526.3 128 544C128 561.7 142.3 576 160 576L480 576C497.7 576 512 561.7 512 544C512 526.3 497.7 512 480 512L480 501C480 458.6 463.1 417.9 433.1 387.9L365.2 320L433.1 252.1C463.1 222.1 480 181.4 480 139L480 128C497.7 128 512 113.7 512 96C512 78.3 497.7 64 480 64L160 64zM416 501L416 512L224 512L224 501C224 475.5 234.1 451.1 252.1 433.1L320 365.2L387.9 433.1C405.9 451.1 416 475.5 416 501z" />
                            </svg>
                            <p>Time: {String(slot.start_time).split('T')[1]} - {String(slot.end_time).split('T')[1]} </p>
                        </div>
                        <p>Number of weeks the slot recurs: {slot.number_weeks_recurrence}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}
export default Slots;