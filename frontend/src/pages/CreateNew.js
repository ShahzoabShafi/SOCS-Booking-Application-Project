import React  from "react";
//Front end: Marie Lefevre

function CreateNew() {
    return (
        <main>
            <h1> Create New </h1>
            <form name="Create" action="A3.php" method="post" autocomplete="on">
                <input type="text" name="firstName" placeholder="*First Name" required/>
                <input type="text" name="lastName" placeholder="*Last Name" required/>
                <input type="email" name="email" placeholder="*Email" required/>            
                
                <input type="date" name="startDay" placeholder="Start date"required/>
                <input type="date" name="endDay" placeholder="End date" required/>

                <textarea id="message" name="message" rows="4" placeholder="*Message" required></textarea>
                <input type="submit" value="Submit"/>
            </form>
        </main>
    )
}
export default CreateNew;