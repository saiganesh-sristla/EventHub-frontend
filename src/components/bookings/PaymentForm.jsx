// client/src/components/bookings/PaymentForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { confirmBooking } from '../../services/bookingService';

const PaymentForm = ({ booking }) => {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  // client/src/components/bookings/PaymentForm.js (continued)
  const [cardName, setCardName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simple validation
    if (!cardNumber || !expiryDate || !cvv || !cardName) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      // In a real app, you'd process payment with Stripe or another provider here
      
      // For this simple version, we'll just confirm the booking
      await confirmBooking(booking._id);
      navigate('/bookings/my-bookings');
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment processing failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Card Holder Name</label>
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm p-2"
            placeholder="John Doe"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm p-2"
            placeholder="4242 4242 4242 4242"
            maxLength="19"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm p-2"
              placeholder="MM/YY"
              maxLength="5"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm p-2"
              placeholder="123"
              maxLength="3"
              required
            />
          </div>
        </div>
        
        <div className="mt-4">
          <p className="font-medium">Total Amount: ${booking.totalAmount.toFixed(2)}</p>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;