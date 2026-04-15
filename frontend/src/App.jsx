import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Slots from './pages/Slots';
import RequestNew from './pages/RequestNew';
import ErrorPage from './pages/ErrorPage';
import Footer from './component/Footer';
import BrowseOwners from './pages/BrowseOwners';
import BookingPage from './pages/BookingPage';
import CreateOfficeHours from './pages/CreateOfficeHours';
import CreateGroup from './pages/CreateGroup';

//Miguel Angel Vargas Valencia
// The main App component that sets up the application's routing
function App() {
  return (
    <Router>
     {/* Flex container to ensure the footer stays at the bottom of the page */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
     {/* Main content area that expands to fill available space */}
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/createOH" element={<CreateOfficeHours />} />
            <Route path="/createGroup" element={<CreateGroup />} />
            <Route path="/slots" element={<Slots />} />
            <Route path="/request" element={<RequestNew />} />
            <Route path="/browse-owners" element={<BrowseOwners />} />
            <Route path="/booking/:ownerId" element={<BookingPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </main>
                {/* The Footer component, which is displayed on all pages */}
        <Footer />
      </div>
    </Router>
  );
}
// Exporting the App component to be used as the root of the application
export default App;
