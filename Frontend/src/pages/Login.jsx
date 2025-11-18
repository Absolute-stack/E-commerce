import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Login.css';

function Login() {
  const [state, setState] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();

    try {
      const url =
        state === 'Login'
          ? import.meta.env.VITE_BACKEND_URL + '/api/user/login'
          : import.meta.env.VITE_BACKEND_URL + '/api/user/register';

      const payload =
        state === 'Login' ? { email, password } : { name, email, password };

      const res = await axios.post(url, payload, { withCredentials: true });

      toast.success(res.data.message || 'Success');

      // 👉 Redirect only when user is logging in
      if (res.data.success && state === 'Login') {
        setTimeout(() => {
          // Only navigate after the toast has had time to display (1 second)
          navigate('/');
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || 'Something Went Wrong. Try Again.'
      );
    }
  }

  return (
    <section className="login-wrapper">
      <div className="login-header">
        <p>{state}</p>
        <span className="line"></span>
      </div>

      <form className="login-form" onSubmit={onSubmit}>
        {state !== 'Login' && (
          <div className="login-form-item">
            <label htmlFor="Name">Name</label>
            <input
              type="text"
              id="Name"
              placeholder="Name or Username..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="login-form-item">
          <label htmlFor="Email">Email</label>
          <input
            type="email"
            id="Email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="login-form-item">
          <label htmlFor="Password">Password</label>
          <input
            type="password"
            id="Password"
            placeholder="Your Password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="submit-btn">
          {state}
        </button>

        {state === 'Login' ? (
          <p onClick={() => setState('Sign Up')} className="caa-btn">
            Create An Account
          </p>
        ) : (
          <p onClick={() => setState('Login')} className="caa-btn">
            Login
          </p>
        )}
      </form>
    </section>
  );
}

export default Login;
