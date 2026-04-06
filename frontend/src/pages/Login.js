import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Front end: Miguel Angel Vargas Valencia

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const goBack = () => {
    navigate(-1);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try{
      const response = await fetch('http://localhost:5000/api/auth/login',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
      });
      const data = await response.json();
      if(!response.ok){
        throw new Error(data.message || 'Failure of login');
      }
      //localstorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/dashboard');
    }catch(err){
      setError(err.message);
    }
  }

  return (

    <main>
      <nav>
        <span>McBooking</span>
        <button onClick={goBack}>Go back</button>
      </nav>
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Sign in</h2>
        <input type="email"
        placeholder='Email'
         value ={email}
         onChange={(e) => setEmail(e.target.value)}
         required
         />

          <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Sign in</button>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <p>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </form>

      <style>{`
        main {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          min-height: 100vh;
          padding-top: 2rem;
          gap: 2rem;
        }
          nav{
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 400px;
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
