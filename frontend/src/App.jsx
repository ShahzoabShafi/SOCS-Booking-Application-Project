import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CreateNew from './pages/CreateNew.jsx';
import RequestNew from './pages/RequestNew.jsx';
import ErrorPage from './pages/ErrorPage.jsx';

// Front end: Miguel Angel Vargas Valencia

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-new" element={<CreateNew />} />
        <Route path="/request-new" element={<RequestNew />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
