import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <main>
      <nav>
        <span>McBooking</span>
        <button onClick={goBack}>Go back</button>
      </nav>
      <form className="login-form">
        <h2>Sign in</h2>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Sign in</button>
        <p>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </form>

      <style>{`
        main {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          gap: 2rem;
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
  );
}

export default Login;
