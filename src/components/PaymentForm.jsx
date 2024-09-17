import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PaymentForm = ({ onPaymentSuccess }) => {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderResponse = await axios.post('https://crud12backend.onrender.com/api/payment/order', {
        amount: amount * 100, // Razorpay accepts amount in paise
        currency: 'INR',
        receipt: 'receipt_1'
      });

      const { id: orderId } = orderResponse.data; // Extract orderId

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: 'Your Company Name',
        description: 'Test Transaction',
        order_id: orderId, // Pass the correct orderId
        handler: async function (response) {
          // Send data to backend for verification
          const verifyResponse = await axios.post('https://crud12backend.onrender.com/api/payment/verify', {
            razorpay_order_id: orderId, // Match backend expectation
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });

          if (verifyResponse.data.message === 'Payment verification successful') {
            alert('Payment Successful!');
            onPaymentSuccess(); // Perform any success logic
            navigate('/crud-page'); // Redirect to your CRUD page
          } else {
            alert('Payment Verification Failed!');
          }
        },
        prefill: {
          name: 'Test User',
          email: 'testuser@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Error initiating payment!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-4">
      <div className="bg-gray-800 text-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Payment Form</h2>
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount in INR"
          className="w-full p-2 mb-4 border border-gray-700 bg-gray-900 text-white rounded"
        />
        <button
          onClick={handlePayment}
          className={`w-full bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;
