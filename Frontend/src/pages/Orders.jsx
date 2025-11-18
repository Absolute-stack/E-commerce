import { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../contxt/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { backend } = useContext(ShopContext);
  const currency = 'GH₵';

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      const res = await axios.post(
        backend + '/api/order/userorders',
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setOrders(res.data.orders || []);
      } else {
        toast.error('Failed to load orders. Please Login and Try Again');
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      Processing: '#ffc107',
      Shipped: '#17a2b8',
      Delivered: '#28a745',
      Cancelled: '#dc3545',
    };
    return colors[status] || '#6c757d';
  };

  const getStatusIcon = (status) => {
    const icons = {
      Processing: '⏳',
      Shipped: '🚚',
      Delivered: '✅',
      Cancelled: '❌',
    };
    return icons[status] || '📦';
  };

  if (loading) {
    return (
      <div className="user-orders">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-orders">
      <div className="orders-header">
        <h2>My Orders</h2>
        <p className="orders-count">
          {orders.length} order{orders.length !== 1 ? 's' : ''}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <div className="no-orders-icon">📦</div>
          <h3>No Orders Yet</h3>
          <p>When you place orders, they will appear here.</p>
          <button
            className="shop-now-btn"
            onClick={() => (window.location.href = '/')}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-id">
                  <span className="label">Order ID:</span>
                  <span className="value">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div
                  className="order-status"
                  style={{
                    background: getStatusColor(order.status) + '20',
                    color: getStatusColor(order.status),
                  }}
                >
                  <span className="status-icon">
                    {getStatusIcon(order.status)}
                  </span>
                  <span className="status-text">{order.status}</span>
                </div>
              </div>

              <div className="order-info">
                <div className="info-row">
                  <span className="info-label">📅 Order Date:</span>
                  <span className="info-value">
                    {new Date(order.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="info-row">
                  <span className="info-label">💳 Payment:</span>
                  <span className="info-value">
                    {order.paymentMethod} {order.payment ? '✓' : '✗'}
                  </span>
                </div>

                <div className="info-row">
                  <span className="info-label">📍 Delivery Address:</span>
                  <span className="info-value">
                    {order.address.street}, {order.address.city},{' '}
                    {order.address.region}
                  </span>
                </div>
              </div>

              <div className="order-items">
                <h4>Items ({order.items.length})</h4>
                <div className="items-grid">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="item-image"
                        />
                      )}
                      <div className="item-details">
                        <p className="item-name">{item.name}</p>
                        <div className="item-specs">
                          <span>Size: {item.size}</span>
                          <span>Qty: {item.quantity}</span>
                          <span className="item-price">
                            {currency}
                            {item.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-footer">
                <button
                  className="details-btn"
                  onClick={() =>
                    setSelectedOrder(
                      selectedOrder === order._id ? null : order._id
                    )
                  }
                >
                  {selectedOrder === order._id
                    ? 'Hide Details'
                    : 'View Details'}
                </button>
                <div className="order-total">
                  <span className="total-label">Total:</span>
                  <span className="total-amount">
                    {currency}
                    {order.amount.toFixed(2)}
                  </span>
                </div>
              </div>

              {selectedOrder === order._id && (
                <div className="order-details-expanded">
                  <div className="detail-section">
                    <h5>Customer Information</h5>
                    <p>
                      <strong>Name:</strong> {order.address.fullname}
                    </p>
                    <p>
                      <strong>Phone:</strong> {order.address.phone}
                    </p>
                    <p>
                      <strong>Email:</strong> {order.address.email || 'N/A'}
                    </p>
                  </div>
                  <div className="detail-section">
                    <h5>Delivery Address</h5>
                    <p>{order.address.street}</p>
                    <p>
                      {order.address.city}, {order.address.region}
                    </p>
                    {order.address.zipcode && (
                      <p>Postal Code: {order.address.zipcode}</p>
                    )}
                  </div>
                  <div className="detail-section">
                    <h5>Order Summary</h5>
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>
                        {currency}
                        {order.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="summary-row">
                      <span>Delivery Fee:</span>
                      <span>Free</span>
                    </div>
                    <div className="summary-row total-row">
                      <span>Total:</span>
                      <span>
                        {currency}
                        {order.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
