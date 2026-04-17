
import { useNavigate } from 'react-router-dom';

// Front end: Miguel Angel Vargas Valencia

//Here we have the main landing page for the application
// It includes the styles compoent

function Landing() {
  const navigate = useNavigate();

  return (
    <>
          {/* Landing-specific styles */}
      <style>
        {`
          nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 32px;
            border-radius: 20px;
          }

          nav span {
            font-size: 20px;
            font-weight: 700;
          }

          nav button {
            padding: 9px 22px;
            cursor: pointer;
            background-color: #81acfc;
            border-radius: 10px;
            border: none;
            color: white;
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

          .hero {
            text-align: center;
            padding: 64px 24px;
          }

          .hero > * {
            margin-bottom: 60px;
          }

          .hero h1 {
            font-weight: 200;
            font-size: 64px;
          }

          .pill {
            display: inline-block;
            background-color: #d0ddf7;
            padding: 6px 18px;
            border-radius: 999px;
            font-size: 14px;
            color: #1a3a6b;
          }

          button.cta {
            padding: 9px 22px;
            cursor: pointer;
            background-color: #81acfc;
            border-radius: 10px;
            border: none;
            color: white;
          }

          button.cta:hover {
            background-color: #1a3a6b;
          }
        `}
      </style>
            {/* Navigation bar */}
      <nav>
        <img src="/mcbooking.png" alt="McBooking Logo" style={{height: "100px"}} />
        <div>
          {/* Sign-in button */}
          <button className="nav-signin-btn" onClick={() => navigate('/login')}>Log in</button>
        </div>
      </nav>
        {/* Main content area */}
      <main>
                {/* Hero section with the main heading and call to action */}
        <section className="hero">
          <p className="pill">McGill University Booking System</p>
          <h1>Booking meetings effortlessly</h1>
          <p className="sub">A simple way for McGill professors and students to manage their scheduling</p>
                  {/* Call-to-action button to navigate to the signup page */}
          <button className="cta" onClick={() => navigate('/signup')}>Get Started</button>
        </section>
      </main>

    </>
  );
}
// Export the Landing component for use in other parts of the app
export default Landing;
