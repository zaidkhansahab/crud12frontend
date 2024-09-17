import React, { useState, useEffect } from 'react';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';
import PaymentForm from '../components/PaymentForm';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const paymentStatus = useSelector((state) => state.users.paymentStatus);

  const handleEditUser = (user) => {
    setCurrentUser(user);
  };

  const clearCurrentUser = () => {
    setCurrentUser(null);
  };

  const fetchAndDisplayUsers = () => {
    dispatch(fetchUsers());
  };

  const handlePaymentSuccess = () => {
    fetchAndDisplayUsers();
    navigate('/crud-page');
  };

  useEffect(() => {
    if (paymentStatus === 'succeeded') {
      fetchAndDisplayUsers();
    }
  }, [paymentStatus]);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 transition-colors duration-500">
      <h1 className="text-4xl font-bold mb-6 text-center">User Management</h1>

      {paymentStatus === 'succeeded' ? (
        <div className="flex flex-col md:flex-row gap-6">
          <UserForm currentUser={currentUser} clearCurrentUser={clearCurrentUser} />
          <UserList onEditUser={handleEditUser} />
        </div>
      ) : (
        <PaymentForm onPaymentSuccess={handlePaymentSuccess} />
      )}
    </div>
  );
};

export default HomePage;
