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
    <div className="flex-1 pt-6 sm:pt-10 sm:pl-16 bg-[var(--color-bg)] text-[var(--color-base)] min-h-screen px-4">
      <h1 className="text-2xl font-bold text-white mb-6">Subscribers</h1>

      <div className="w-full max-w-5xl overflow-x-auto rounded-xl shadow-lg bg-[#1a1a1a] border border-gray-700">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="uppercase text-xs bg-[#121212] text-gray-400 border-b border-gray-700">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Subscribed At</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length > 0 ? (
              subscribers.map((sub, index) => (
                <tr
                  key={sub._id}
                  className="border-b border-gray-700 hover:bg-[#222] transition-all"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 break-words max-w-sm">{sub.email}</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">
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
