import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addUser, updateUser } from '../features/userSlice';

const UserForm = ({ currentUser, clearCurrentUser }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ title: '', description: '' });

  useEffect(() => {
    if (currentUser) {
      setFormData(currentUser);
    }
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentUser) {
      dispatch(updateUser({ id: currentUser._id, user: formData }));
    } else {
      dispatch(addUser(formData));
    }
    clearCurrentUser();
    setFormData({ title: '', description: '' });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md mx-auto"
    >
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {currentUser ? 'Update User' : 'Add User'}
      </h2>

      {/* Title Input */}
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
          Title
        </label>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
        />
      </div>

      {/* Description Input */}
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
          Description
        </label>
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
        ></textarea>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
          currentUser
            ? 'bg-yellow-500 hover:bg-yellow-600'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {currentUser ? 'Update User' : 'Add User'}
      </button>
    </form>
  );
};

export default UserForm;
