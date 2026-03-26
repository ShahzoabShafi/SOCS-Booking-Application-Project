import React  from "react";
//Marie Lefevre

function CreateNew() {
    return (
        <main>
            <div class="nav">
                <div>
                    <img src="mcbooking.png"></img>
                </div>
                <div class="menu">
                    <a href="" id="back"> Back </a>
                    <a href="" id="exit"> Log Out </a>
                </div>
            </div>
            <div class="form-container">
                <form name="Create" action="A3.php" method="post" autocomplete="on">
                    <h1> Create New </h1>
                    Mode: <input type="radio" name="recurring" value="u">Recurring</input>
                    <input type="radio" name="once" value="once">One-time</input><br />

                    <input type="text" name="topic" placeholder="*Topic" required/> <br />
                    <label for="Date">Start Date: </label>
                    <input type="date" name="date" id="Date" required/> <br />
                    <label for="date2">End Date: </label>
                    <input type="date" name="date" id="date2" required/> <br />
                    <label for="start">Start Time: </label>
                    <input type="time" name="startTime" id="start" required/> <br />
                    <label for="end">End Time: </label>
                    <input type="time" name="endTime" id="end" required/> <br />

                    <input type="submit" value="Submit"/>
                </form>
            </div>
        </main>
    )
}
export default CreateNew;