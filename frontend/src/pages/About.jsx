import React from 'react';
import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();

  return (
    <>
      {/* Navigation bar, exactly matching the landing page */}
      <nav>
        <img src="/mcbooking.png" alt="McBooking Logo" style={{ height: "100px", cursor: "pointer" }} onClick={() => navigate('/')} />
        <div>
          {/* Go back button */}
          <button className="nav-signin-btn" style={{ marginRight: '1rem' }} onClick={() => navigate(-1)}>Go back</button>
          {/* About us button */}
          <button className="nav-signin-btn" style={{ marginRight: '1rem' }} onClick={() => navigate('/about')}>About Us</button>
          {/* Sign-in button */}
          <button className="nav-signin-btn" onClick={() => navigate('/login')}>Log in</button>
        </div>
      </nav>

      <main className="about-main">
        <section className="about-section">
          <h1 className="fancy-title">About Us</h1>

          <div className="members-grid">
            <div className="member-card">
              <h2>Miguel</h2>
              <p>Front end develpment: computer science and biology</p>
            </div>
            <div className="member-card">
              <h2>Shazoab</h2>
              <p>back end, computer science loves computer science</p>
            </div>
            <div className="member-card">
              <h2>Marie</h2>
              <p>Front end developper, loves sport and is in biologie</p>
            </div>
            <div className="member-card">
              <h2>Ryan</h2>
              <p>Back end, biology, likes lizzards</p>
            </div>
          </div>
        </section>
      </main>

      {/* Styled block moved to the end as requested */}
      <style>
        {`
          nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 32px;
            border-radius: 20px;
          }

          nav button {
            padding: 9px 22px;
            cursor: pointer;
            background-color: #81acfc;
            border-radius: 10px;
            border: none;
            color: white;
            font-size: 16px;
          }

          nav button:hover {
            background-color: #1a3a6b;
          }
          
          nav button.nav-signin-btn {
            background-color: transparent;
            border: 1px solid #d1d5db;
            color: #333;
          }

          nav button.nav-signin-btn:hover {
            background-color: #f3f4f6;
          }

          .about-main {
            background-color: #e4eaf5;
            min-height: 100vh;
            padding: 2rem;
            font-family: sans-serif;
            margin-top: -20px; /* Optional adjustment if nav padding causes a gap */
          }

          .about-section {
            text-align: center;
            max-width: 800px;
            margin: 0 auto;
          }

          .fancy-title {
            font-family: 'Playfair Display', 'Georgia', serif;
            font-size: 4rem;
            color: #1a3a6b;
            margin-bottom: 3rem;
            font-style: italic;
            letter-spacing: 1px;
          }

          .members-grid {
            display: flex;
            flex-direction: column;
            gap: 30px;
          }

          .member-card {
            padding: 1.5rem 0;
            border-bottom: 1px solid #d1d5db;
          }

          .member-card:last-child {
            border-bottom: none;
          }

          .member-card h2 {
            color: #81acfc;
            font-size: 2.5rem;
            margin: 0;
          }

          .member-card p {
            color: #4b5563;
            margin-top: 10px;
            font-size: 20px;
          }
        `}
      </style>
    </>
  );
}

export default About;
