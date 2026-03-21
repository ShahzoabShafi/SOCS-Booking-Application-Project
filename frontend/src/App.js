import './App.css';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Footer from './component/Footer';
import Dashboard from './pages/Dashboard';


// Front end: Miguel Angel Vargas Valencia

function Landing() {
  const navigate = useNavigate();

  return (
    <>
      <nav>
        <img src="/mcbooking.png" alt="McBooking Logo" style={{height: "100px"}} />
        <div>
          <button style={{"marginRight": "10px"}} onClick={() => navigate('/dashboard')}>Dashboard Perso(temporary button)</button>
          <button style={{"marginRight": "10px"}} onClick={() => navigate('/dashboard')}>Dashboard Admin(temporary button)</button>
          <button onClick={() => navigate('/login')}>Sign in</button>
        </div>
      </nav>

      <main>
        <section className="hero">
          <p className="pill">McGill University Booking System</p>
          <h1>Booking meetings effortlessly</h1>
          <p className="sub">A simple way for McGill professors and students to manage their scheduling</p>
          <button className="cta" onClick={() => navigate('/signup')}>Get Started</button>
        </section>
      </main>

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
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
