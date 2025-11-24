import https from 'https';
import orderModel from '../models/orderModel.js';

// VERIFY PAYMENT
async function verifyPayment(req, res) {
  try {
    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'No reference provided',
      });
    }

    if (!process.env.PAYSTACK_SECRET) {
      console.error('PAYSTACK_SECRET not found in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Payment gateway configuration error',
      });
    }

    console.log('Verifying payment with reference:', reference);

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: `/transaction/verify/${reference}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
      },
    };

    const paystackReq = https.request(options, (psRes) => {
      let data = '';

      psRes.on('data', (chunk) => {
        data += chunk;
      });

      psRes.on('end', async () => {
        try {
          const result = JSON.parse(data);
          console.log('Paystack Response:', result);

          if (!result.status) {
            return res.status(400).json({
              success: false,
              message: result.message || 'Verification failed',
            });
          }

          const payment = result.data;
          if (payment.status !== 'success') {
            return res.status(400).json({
              success: false,
              message: `Payment status: ${payment.status}`,
            });
          }

          if (!payment.metadata) {
            console.error('No metadata in payment response');
            return res.status(400).json({
              success: false,
              message: 'Payment metadata missing',
            });
          }

          // CRITICAL FIX: Parse metadata if it's a string
          let metadata = payment.metadata;
          if (typeof metadata === 'string') {
            try {
              metadata = JSON.parse(metadata);
              console.log('Parsed metadata:', metadata);
            } catch (err) {
              console.error('Failed to parse metadata string:', err);
              return res.status(400).json({
                success: false,
                message: 'Invalid metadata format',
              });
            }
          }

          // Now parse items and address from the metadata object
          let items, address, userId;
          try {
            // Parse items (it's a string inside metadata)
            items =
              typeof metadata.items === 'string'
                ? JSON.parse(metadata.items)
                : metadata.items;

            // Parse address (it's a string inside metadata)
            address =
              typeof metadata.address === 'string'
                ? JSON.parse(metadata.address)
                : metadata.address;

            userId = metadata.userId;

            console.log('Parsed userId:', userId);
            console.log('Parsed items:', items);
            console.log('Parsed address:', address);

            // Validate required fields
            if (!items || !address || !userId) {
              throw new Error('Missing required metadata fields');
            }
          } catch (err) {
            console.error('Metadata parse error:', err);
            console.error('Metadata object:', metadata);
            return res.status(400).json({
              success: false,
              message: 'Invalid payment metadata format',
              debug: {
                metadata: metadata,
                error: err.message,
              },
            });
          }

          // Save order to database
          const newOrder = await orderModel.create({
            userId: userId,
            items: items,
            amount: payment.amount / 100, // Convert from kobo/pesewas to GHS
            address: address,
            status: 'Processing',
            paymentMethod: 'Paystack',
            payment: true,
            date: Date.now(),
          });

          console.log('Order created successfully:', newOrder._id);

          return res.json({
            success: true,
            message: 'Payment verified successfully',
            order: newOrder,
          });
        } catch (error) {
          console.error('Order creation error:', error);
          return res.status(500).json({
            success: false,
            message: 'Error processing order',
            error: error.message,
          });
        }
      });
    });

    paystackReq.on('error', (error) => {
      console.error('HTTPS Request Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error connecting to Paystack',
        error: error.message,
      });
    });

    paystackReq.end();
  } catch (error) {
    console.error('Unexpected error in verifyPayment:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}

// ADMIN — ALL ORDERS
async function allOrders(req, res) {
  try {
    const orders = await orderModel.find().sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
}

// ADMIN — UPDATE STATUS
async function updateStatus(req, res) {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and status are required',
      });
    }

    await orderModel.findByIdAndUpdate(orderId, { status });

    res.json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ success: false, message: 'Update failed' });
  }
}

// USER — GET ORDERS
async function userOrders(req, res) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const orders = await orderModel.find({ userId }).sort({ date: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error('User orders error:', error);
    res.status(500).json({ success: false, message: 'Unable to load orders' });
  }
}

export { allOrders, updateStatus, userOrders, verifyPayment };
