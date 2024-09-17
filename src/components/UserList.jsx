import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, deleteUser } from '../features/userSlice';

const UserList = ({ onEdit }) => {
  const dispatch = useDispatch();
  const { users, status } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteUser(id));
  };

  if (status === 'loading') return <div className="text-center">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">
        User List
      </h2>

      {/* Scrollable container */}
      <div className="max-h-screen overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
          {users.map((user) => (
            <div key={user._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md relative">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap overflow-hidden">
                <span className="block hover:overflow-auto hover:whitespace-normal">
                  {user.title}
                </span>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 whitespace-nowrap overflow-hidden">
                <span className="block hover:overflow-auto hover:whitespace-normal">
                  {user.description}
                </span>
              </p>

              <div className="flex justify-between items-center">
                {/* Edit Button */}
                <button
                  onClick={() => onEdit(user)}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                >
                  Edit
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserList;
