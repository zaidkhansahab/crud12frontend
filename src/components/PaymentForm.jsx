import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // For handling button state

  const handlePayment = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    setIsSubmitting(true); // Set submitting state to true

    try {
      // Create an order by calling your backend
      const orderResponse = await axios.post('http://localhost:5000/api/payment/order', {
        amount: amount * 100, // Amount in paise (convert from INR)
        currency: 'INR',
        receipt: 'receipt_1'
      });

      const { orderId } = orderResponse.data;

      // Proceed to Razorpay payment
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use the key from environment variables
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: 'Your Company Name',
        description: 'Test Transaction',
        order_id: orderId, // Order ID from backend
        handler: async function (response) {
          const verifyResponse = await axios.post('http://localhost:5000/api/payment/verify', {
            order_id: orderId,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature
          });

          if (verifyResponse.data.success) {
            alert('Payment Successful!');
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
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Payment Form</h2>
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount in INR"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <button
          onClick={handlePayment}
          className={`w-full bg-blue-500 text-white font-bold py-2 px-4 rounded shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;
