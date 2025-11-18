import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/Admincontext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assest.js';
import './Navbar.css';

function Navbar() {
  const { setToken, backend } = useContext(AdminContext);
  const navigate = useNavigate();

  async function Logout() {
    try {
      const res = await axios.post(
        `${backend}/api/user/logout`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setToken(false);
        navigate('/'); // ✅ immediately go back to login
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  }

  return (
    <nav className="main-nav flex-sb">
      <img src={assets.logo} alt="Logo" />
      <button onClick={Logout}>Logout</button>
    </nav>
  );
}

export default Navbar;
