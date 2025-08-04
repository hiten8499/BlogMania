import React, { useEffect, useState } from 'react';
import CommentTableItem from '../../components/admin/CommentTableItem';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState('Not Approved');

  const { axios } = useAppContext();

  const fetchComments = async () => {
    try {
      const { data } = await axios.get('/api/admin/comments');
      data.success ? setComments(data.comments) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const filteredComments = comments.filter((comment) =>
    filter === 'Approved' ? comment.isApproved === true : comment.isApproved === false
  );

  return (
    <div className="flex-1 pt-5 px-5 sm:pt sm:pl-16 bg-[var(--color-bg)] text-[var(--color-base)]">
      {/* Header */}
      <div className="flex justify-between items-center max-w-4xl border-b border-gray-700 pb-3">
        <h1 className="text-xl font-semibold text-white">Comments</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setFilter('Approved')}
            className={`px-4 py-1 rounded-full text-xs transition border ${
              filter === 'Approved'
                ? 'bg-green-600 text-white border-green-600'
                : 'border-gray-600 text-gray-400 hover:border-gray-400'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('Not Approved')}
            className={`px-4 py-1 rounded-full text-xs transition border ${
              filter === 'Not Approved'
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                : 'border-gray-600 text-gray-400 hover:border-gray-400'
            }`}
          >
            Not Approved
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="relative h-4/5 max-w-4xl overflow-x-auto mt-4 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-lg scrollbar-hide">
        <table className="w-full text-sm text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-[#121212] border-b border-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">Blog Title & Comments</th>
              <th scope="col" className="px-6 py-3 max-sm:hidden">Date</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredComments.map((comment, index) => (
              <CommentTableItem
                key={comment._id}
                comments={comment}
                index={index + 1}
                fetchComments={fetchComments}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Comments;
