import React from "react";
import '../Dashboard.css'; // Corrected CSS import
//Marie Lefevre

//Miguel: made some modifs

function CreateNew() {
    return (
        <main>
            <div className="navBar"> {/* Corrected className */}
                <div>
                    <img src="/mcbooking.png" alt="McBooking Logo" /> {/* Corrected image path */}
                </div>
                <div className="menu">
                    <button id="back"> Back </button>
                    <button id="exit"> Log Out </button>
                </div>
            </div>
            <div className="form-container">
                <form name="Create">
                    <h1> Create New </h1>
                    <label>Mode:</label>
                    <label>
                        <input type="radio" name="mode" value="recurring" /> Recurring
                    </label>
                    <label>
                        <input type="radio" name="mode" value="one-time" /> One-time
                    </label>
                    <br />

                    <input type="text" name="topic" placeholder="*Topic" required /> <br />
                    <label htmlFor="start_time">Start Date: </label>
                    <input type="datetime-local" name="start_date" id="start_time" required /> <br />
                    <label htmlFor="end_time">End Date: </label>
                    <input type="datetime-local" name="end_date" id="end_time" required /> <br />
                
                    <input type="submit" value="Submit" />
                </form>
            </div>
        </main>
    )
}
export default CreateNew;
