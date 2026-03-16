import './App.css';

function App() {
  return (
    <>
      <nav>
        <span>McBooking</span>
        <a><button>Sign in</button></a>
      </nav>

      <main>
        <section className="hero">
          <p className="pill">McGill University Booking System</p>
          <h1>Booking meetings effortlessly</h1>
          <p className="sub">A simple way for McGill professors and students to manage their scheduling</p>
          <button className="cta">Get Started</button>
        </section>
      </main>

      <footer>
        <span>McBooking – McGill University</span>
        <span>Built for COMP 307</span>
      </footer>
    </>
  );
}

export default App;