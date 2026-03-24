import React  from "react";

//Front end: Marie Lefevre
    

function Dashboard() {
    async function loadBookings() {
        const response = await fetch('bookings.json');
        const bookings = await response.json()

        const list = document.getElementById('bookingList');

        //for each booking in the database, create a <div class card> with the booking info
        bookings.forEach(booking => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <div class="header-line">
                <h3>${booking.title}</h3>
                <button><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
                    <path d="M262.2 48C248.9 48 236.9 56.3 232.2 68.8L216 112L120 112C106.7 112 96 122.7 96 136C96 149.3 106.7 160 120 160L520 160C533.3 160 544 149.3 544 136C544 122.7 533.3 112 520 112L424 112L407.8 68.8C403.1 56.3 391.2 48 377.8 48L262.2 48zM128 208L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 208L464 208L464 512C464 520.8 456.8 528 448 528L192 528C183.2 528 176 520.8 176 512L176 208L128 208zM288 280C288 266.7 277.3 256 264 256C250.7 256 240 266.7 240 280L240 456C240 469.3 250.7 480 264 480C277.3 480 288 469.3 288 456L288 280zM400 280C400 266.7 389.3 256 376 256C362.7 256 352 266.7 352 280L352 456C352 469.3 362.7 480 376 480C389.3 480 400 469.3 400 456L400 280z"/>
                </svg>
                </button>
            </div>
            <div class="line">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
                    <path d="M224 64C241.7 64 256 78.3 256 96L256 128L384 128L384 96C384 78.3 398.3 64 416 64C433.7 64 448 78.3 448 96L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 96C192 78.3 206.3 64 224 64zM224 320C206.3 320 192 334.3 192 352L192 416C192 433.7 206.3 448 224 448L288 448C305.7 448 320 433.7 320 416L320 352C320 334.3 305.7 320 288 320L224 320z"/>
                </svg>
                <p>Date: ${booking.date}</p>
            </div>
            <div class="line">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
                    <path d="M160 64C142.3 64 128 78.3 128 96C128 113.7 142.3 128 160 128L160 139C160 181.4 176.9 222.1 206.9 252.1L274.8 320L206.9 387.9C176.9 417.9 160 458.6 160 501L160 512C142.3 512 128 526.3 128 544C128 561.7 142.3 576 160 576L480 576C497.7 576 512 561.7 512 544C512 526.3 497.7 512 480 512L480 501C480 458.6 463.1 417.9 433.1 387.9L365.2 320L433.1 252.1C463.1 222.1 480 181.4 480 139L480 128C497.7 128 512 113.7 512 96C512 78.3 497.7 64 480 64L160 64zM416 501L416 512L224 512L224 501C224 475.5 234.1 451.1 252.1 433.1L320 365.2L387.9 433.1C405.9 451.1 416 475.5 416 501z"/>
                </svg>
                <p>Time: ${booking.startTime} - ${booking.endTime} </p>
            </div>
            <p>With: ${booking.booker}</p> <!--this will either say group or the name of the person who booked the appointment-->
        `;

        list.appendChild(card);
        });
    }
    loadBookings();
    return(
        <main>
            <style> {`
                body {
                    margin: 0px;
                    background: #e4eaf5;
                }
                .navBar {
                    background-color: rgb(255, 255, 255);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    height: 7rem;
                }
                .navBar .menu {
                    display: flex;
                    gap: 10px;
                }
                .navBar img {
                    height: 7rem;
                    margin: 2rem;
                }
                h1 {
                    text-align: center;
                    margin: 2rem;
                }
                .navBar a {
                    background-color: #81ACFC;
                    padding: 15px 30px;
                    color: white;
                    text-decoration: none;
                    display: inline-block;
                    margin: 2rem;
                    font-size: 2vw;
                }
                .navBar a:hover {
                    background-color: #1a3a6b;
                    padding: 15px 30px;
                    text-decoration: none;
                    display: inline-block;
                    margin: 2rem;
                }
                #bookingList {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5vw;
                    margin: 2rem;
                    align-items: center;
                }
                .card {
                    background-color: #63B0CD;
                    border: 1px solid black;
                    transition: box-shadow 0.2s ease;
                    padding: 15px 30px;
                    width: 80%;
                    color: white;
                    border-radius: 5px;
                }
                .header-line {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .line {
                    display: flex;
                    gap: 2vw;
                    align-items: center;
                }
                .card svg {
                    height: 30px;
                    width: 30px;
                    fill: #0A2342; 
                }
                .card:hover {
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
                }
                #create {
                    display: none;
                }
            `}
            </style>
            <div class="navBar" id="navBar">
                <div>
                    <img src="mcbooking.png" alt="mcbooking logo"></img>
                </div>
                <div class="menu">
                    <a href="/" id="booking" > Book New </a>
                    <a href="/" id="create"> Create New </a>
                    <a href="/" id="exit"> Log Out </a>
                </div>
            </div>
            <h1> My Appointments </h1>
            <div id="bookingList"></div>
        </main>
    )
}
export default Dashboard;