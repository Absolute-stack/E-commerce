import { Routes, Route } from 'react-router-dom';
import './App.css';
import { useContext, useEffect, useState } from 'react';
import { AdminContext } from './context/Admincontext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login.jsx';
import Add from './pages/Add.jsx';
import List from './pages/List.jsx';
import Orders from './pages/Orders.jsx';
import Home from './pages/Home.jsx';
import Navbar from './components/Navbar.jsx';
import axios from 'axios';
import Sidebar from './components/Sidebar.jsx';

function App() {
  const { token, setToken, backend } = useContext(AdminContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔵 App mounted');
    console.log('🔵 Backend:', backend);
    console.log('🔵 Token:', token);

    async function verifyAdmin() {
      // Don't verify if backend is not configured
      if (!backend) {
        console.error('❌ Backend URL is not configured!');
        console.log(
          'Check your .env file has: VITE_BACKEND_URL=http://localhost:9000'
        );
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔵 Verifying admin...');
        const res = await axios.get(`${backend}/api/user/verify`, {
          withCredentials: true,
        });
        console.log('✅ Verify response:', res.data);

        if (res.data.success) {
          setToken(true);
        } else {
          setToken(false);
        }
      } catch (error) {
        console.log('⚠️ Verify failed (user not logged in):', error.message);
        setToken(false);
      } finally {
        setIsLoading(false);
      }
    }

    verifyAdmin();
  }, [backend]);

  // Show loading state while verifying
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '20px',
          backgroundColor: '#f5f5f5',
        }}
      >
        Loading...
      </div>
    );
  }

  // Show login if not authenticated
  if (!token) {
    console.log('🔵 Rendering Login');
    return (
      <>
        <ToastContainer />
        <Login />
      </>
    );
  }

  // Show admin panel if authenticated
  console.log('🔵 Rendering Admin Panel');
  return (
    <>
      <ToastContainer />
      <Navbar />
      <div className="seperator">
        <div>
          <Sidebar />
        </div>
        <div className="main-display">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<Add />} />
            <Route path="/list" element={<List />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
