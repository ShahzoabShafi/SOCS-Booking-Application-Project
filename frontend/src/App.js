import './App.css';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Front end: Miguel Angel Vargas Valencia

function Landing() {
  const navigate = useNavigate();

  return (
    <>
      <nav>
        <span>McBooking</span>
        <button onClick={() => navigate('/login')}>Sign in</button>
      </nav>

      <main>
        <section className="hero">
          <p className="pill">McGill University Booking System</p>
          <h1>Booking meetings effortlessly</h1>
          <p className="sub">A simple way for McGill professors and students to manage their scheduling</p>
          <button className="cta" onClick={() => navigate('/signup')}>Get Started</button>
        </section>
      </main>

      <footer>
        <span>McBooking – McGill University</span>
        <span> A project by students for students</span>
      </footer>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;