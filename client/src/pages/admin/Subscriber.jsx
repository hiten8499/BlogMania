import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Subscriber = () => {
  const { axios } = useAppContext();
  const [subscribers, setSubscribers] = useState([]);

  const fetchSubscribers = async () => {
    try {
      const { data } = await axios.get('/api/admin/subscribers');
      if (data.success) {
        setSubscribers(data.subscribers);
      } else {
        toast.error(data.message || 'Failed to fetch subscribers');
      }
    } catch (error) {
      toast.error('Error fetching subscribers');
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  return (
    <div className="flex-1 pt-6 sm:pt-10 sm:pl-16 bg-blue-50/50 min-h-screen px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Subscribers</h1>

      <div className="w-full max-w-5xl overflow-x-auto rounded-xl shadow bg-white border">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="uppercase text-xs bg-gray-100 text-gray-600 border-b">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Subscribed At</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length > 0 ? (
              subscribers.map((sub, index) => (
                <tr key={sub._id} className="border-b hover:bg-gray-50 transition-all">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 break-words max-w-sm">{sub.email}</td>
                  <td className="px-4 py-3 text-gray-500 text-sm">
                    {new Date(sub.createdAt || sub.subscribedAt).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                  No subscribers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Subscriber;
