import React from "react";

function Footer(){
    const footerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '20px',
        backgroundColor: '#f2f2f2',
        borderTop: '1px solid #ddd'
      };
    return(
        <footer style={footerStyle}>
            <span>McBooking – McGill University</span>
            <span> A project by students for students</span>
        </footer>
);
}
export default Footer;
