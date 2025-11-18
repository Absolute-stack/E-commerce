import { useState, useEffect, useContext } from 'react';
import { AdminContext } from '../context/Admincontext';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { backend } = useContext(AdminContext);
  const currency = 'GH₵';

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      const res = await axios.post(
        `${backend}/api/order/list`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setOrders(res.data.orders || []);
      } else {
        toast.error('Failed to load orders');
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId, newStatus) {
    try {
      const res = await axios.post(
        `${backend}/api/order/status`,
        { orderId, status: newStatus },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success('Status updated');
        loadOrders(); // Reload orders
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>📦 Order Management</h2>
        <span className="orders-count">{orders.length} Total Orders</span>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <div className="no-orders-icon">📭</div>
          <h3>No Orders Yet</h3>
          <p>Customer orders will appear here</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div className="order-id-section">
                  <span className="order-id-label">Order ID</span>
                  <span className="order-id-value">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="order-content">
                <div className="order-details-grid">
                  <div className="order-detail-item">
                    <strong>👤 Customer</strong>
                    <span>{order.address.fullname}</span>
                  </div>
                  <div className="order-detail-item">
                    <strong>📞 Phone</strong>
                    <span>{order.address.phone}</span>
                  </div>
                  <div className="order-detail-item order-detail-full">
                    <strong>📍 Delivery Address</strong>
                    <span>
                      {order.address.street}, {order.address.city},{' '}
                      {order.address.region}
                    </span>
                  </div>
                  <div className="order-detail-item">
                    <strong>🛍️ Items</strong>
                    <span className="items-badge">
                      {order.items.length} Items
                    </span>
                  </div>
                </div>

                <div className="order-divider"></div>

                <div className="date-section">
                  <strong>📅</strong>
                  <span>
                    {new Date(order.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="status-section">
                  <strong>Status</strong>
                  <select
                    className="status-select"
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order._id, e.target.value)
                    }
                  >
                    <option value="Processing">⏳ Processing</option>
                    <option value="Shipped">🚚 Shipped</option>
                    <option value="Delivered">✅ Delivered</option>
                    <option value="Cancelled">❌ Cancelled</option>
                  </select>
                </div>

                <div className="total-amount">
                  <strong>Total Amount</strong>
                  <span>
                    {currency}
                    {order.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
