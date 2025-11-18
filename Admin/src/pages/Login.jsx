import { useContext, useState, useEffect } from 'react';
import { AdminContext } from '../context/Admincontext';
import axios from 'axios';
import './Login.css';
import { toast } from 'react-toastify';

function Login() {
  // Add visual indicator that component is rendering
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    setRenderCount((prev) => prev + 1);
  }, []);

  const context = useContext(AdminContext);
  const { setToken, backend } = context || {};

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    contextExists: !!context,
    backendUrl: backend || 'undefined',
    envBackend: import.meta.env.VITE_BACKEND_URL || 'undefined',
  });

  useEffect(() => {
    // Force console output with alert as backup
    const info = {
      contextExists: !!context,
      backendUrl: backend || 'undefined',
      envBackend: import.meta.env.VITE_BACKEND_URL || 'undefined',
      renderCount,
    };

    setDebugInfo(info);

    // If console logs don't work, this will still show
    if (renderCount === 1) {
      console.log('LOGIN DEBUG:', JSON.stringify(info, null, 2));
    }
  }, [context, backend, renderCount]);

  async function handleSubmit(e) {
    e.preventDefault();

    // Add visual feedback
    const submissionInfo = {
      email,
      passwordLength: password.length,
      backend,
      timestamp: new Date().toISOString(),
    };

    alert(`Form Submitted!\n${JSON.stringify(submissionInfo, null, 2)}`);

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!backend) {
      toast.error('Backend URL is not configured');
      alert('ERROR: Backend is undefined!');
      return;
    }

    try {
      setLoading(true);
      const url = backend + '/api/user/admin';

      alert(`Sending request to: ${url}`);

      const res = await axios.post(
        url,
        { email, password },
        { withCredentials: true }
      );

      alert(`Response received: ${JSON.stringify(res.data)}`);

      if (res.data.success) {
        toast.success(res.data.message);
        if (res.data.token) {
          setToken(res.data.token);
        } else {
          setToken(true);
        }
      } else {
        toast.error(res.data.message || 'Login failed');
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || error.message || 'Unknown error';
      alert(`ERROR: ${errorMsg}`);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="login-container"
      style={{
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="login-form"
        style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          margin: '0 auto',
        }}
      >
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>
          Admin Login Panel
        </h2>

        <div className="form-item" style={{ marginBottom: '15px' }}>
          <label
            htmlFor="email-input-field"
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
            }}
          >
            Email
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            name="email-input-field"
            id="email-input-field"
            placeholder="Your Email..."
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
        </div>

        <div className="form-item" style={{ marginBottom: '20px' }}>
          <label
            htmlFor="password-input-field"
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
            }}
          >
            Password
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            name="password-input-field"
            id="password-input-field"
            placeholder="Your Password..."
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'LOGGING IN...' : 'LOGIN'}
        </button>
      </form>
    </div>
  );
}

export default Login;
