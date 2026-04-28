import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
// Front end: Miguel Angel Vargas Valencia


function Signup() {
  //States are variable for user input
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  //function to navigate back to the previous page
  const goBack = () => {
    navigate(-1);
  };
  //Function to handle the signup process
  const handleSignup = async (e) => {
    e.preventDefault(); //We prevent the default from submision behavour
    setError(''); // we clear any previous errors

    // Validate for a McGill Email on the frontend 
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(mcgill\.ca|mail\.mcgill\.ca)$/;
    if (!emailRegex.test(email)) {
      setError('A valid McGill email address (@mcgill.ca or @mail.mcgill.ca) is required.');
      return;
    }
    // Check if the passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    // We send a POST request to registration endpoint
    try {
      const response = await fetch('http://winter2026-comp307-group15.cs.mcgill.ca:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: fullName, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }
      // If successful, navigate to the login page
      navigate('/login');
    } catch (err) {
      //set error message if registration fails
      setError(err.message);
    }
  };

  return (
    <>
      {/* Navigation bar */}
      <nav>
        <img src="/mcbooking.png" alt="McBooking Logo" style={{ height: "100px", cursor: "pointer" }} onClick={() => navigate('/')} />
        <button onClick={goBack}>Go back</button>
      </nav>
      <main>
        <form className="login-form" onSubmit={handleSignup}>
          <h2>Create an account</h2>
          {/* Input for full name */}
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          {/* Input for  email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* Input to enter password & cnofirm password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          <p>
            Already have an account? <a href="/login">Log in</a>
          </p>
        </form>
        {/* Style for the above page*/}
        <style>{`
        main {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            min-height: 80vh;
            padding-top: 2rem;
            gap: 2rem;
            width: 100%;
        }
        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          box-sizing: border-box;
          padding: 0 32px;
        }
        nav button {
            padding: 9px 22px;
            cursor: pointer;
            background-color: transparent;
            border-radius: 10px;
            border: 1px solid #d1d5db;
            color: #333;
        }
        nav button:hover {
            background-color: #f3f4f6;
        }
        .login-form {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 400px;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .login-form h2 {
            text-align: center;
            margin: 0 0 1rem 0;
        }
        .login-form input {
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 1rem;
        }
        .login-form button {
            padding: 0.75rem;
            background-color: #81acfc;
            color: white;
            border: none;
            border-radius: 0.5rem;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
        }
        .login-form button:hover {
            background-color: #1a3a6b;
        }
        .login-form p {
            text-align: center;
            margin: 0;
        }
      `}</style>
      </main>
    </>
  );
}
export default Signup;
