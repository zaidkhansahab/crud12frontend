import React, { useState, useEffect } from 'react';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';

const HomePage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState('light');

  const handleEditUser = (user) => {
    setCurrentUser(user);
  };

  const clearCurrentUser = () => {
    setCurrentUser(null);
  };

  // Toggle theme between light and dark
  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  };

  useEffect(() => {
    // Set theme from localStorage (if stored)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-6 transition-colors duration-500">
      <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
        CRUD Application
      </h1>

      {/* Theme Toggle Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Form Section */}
        <div className="order-2 md:order-1">
          <UserForm currentUser={currentUser} clearCurrentUser={clearCurrentUser} />
        </div>

        {/* User List Section */}
        <div className="order-1 md:order-2">
          <UserList onEdit={handleEditUser} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
