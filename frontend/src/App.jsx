import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateNew from './pages/CreateNew';
import RequestNew from './pages/RequestNew';
import ErrorPage from './pages/ErrorPage';
import Footer from './component/Footer';
import BrowseOwners from './pages/BrowseOwners';
import BookingPage from './pages/BookingPage';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-new" element={<CreateNew />} />
            <Route path="/request-new" element={<RequestNew />} />
            <Route path="/browse-owners" element={<BrowseOwners />} />
            <Route path="/booking/:ownerId" element={<BookingPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
