import { useEffect, useContext, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../contxt/ShopContext.jsx';

function Verify() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { backend, clearCart } = useContext(ShopContext);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);

  // Use backend from context
  const API_URL =
    backend || import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';

  useEffect(() => {
    async function verifyPayment() {
      const reference = params.get('reference');

      if (!reference) {
        toast.error('No payment reference found');
        return navigate('/cart');
      }

      try {
        setVerifying(true);
        console.log('Verifying payment with reference:', reference);
        console.log('Using backend URL:', API_URL);

        const response = await axios.post(`${API_URL}/api/order/verify`, {
          reference,
        });

        console.log('Verification response:', response.data);

        if (response.data.success) {
          toast.success('Payment verified successfully! 🎉');

          // IMPORTANT: Clear cart AFTER successful verification
          console.log('Clearing cart...');
          await clearCart();
          console.log('Cart cleared successfully');

          // Small delay to show success message
          setTimeout(() => {
            navigate('/orders');
          }, 1000);
        } else {
          toast.error(response.data.message || 'Payment verification failed');
          navigate('/cart');
        }
      } catch (err) {
        console.error('Verification error:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          url: `${API_URL}/api/order/verify`,
        });

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Payment verification failed';
        toast.error(errorMessage);
        setError(errorMessage);
        setVerifying(false);

        // Don't navigate immediately, let user see the error
        setTimeout(() => {
          navigate('/cart');
        }, 3000);
      }
    }

    verifyPayment();
  }, [params, navigate, API_URL, clearCart]);

  if (error) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '50px',
          maxWidth: '500px',
          margin: '0 auto',
        }}
      >
        <h1 style={{ color: 'red' }}>❌ Verification Failed</h1>
        <p>{error}</p>
        <p>Redirecting to cart...</p>
      </div>
    );
  }

  if (verifying) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '50px',
          maxWidth: '500px',
          margin: '0 auto',
        }}
      >
        <h1>⏳ Verifying Payment...</h1>
        <p>Please wait while we confirm your payment.</p>
        <div
          style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            animation: 'spin 1s linear infinite',
            margin: '20px auto',
          }}
        ></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return null;
}

export default Verify;
