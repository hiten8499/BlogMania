import React from 'react';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const CommentTableItem = ({ comments, fetchComments }) => {
  const { blog, createdAt, _id, name, content, isApproved } = comments;
  const commentDate = new Date(createdAt);
  const { axios } = useAppContext();

  const approveComment = async () => {
    try {
      const { data } = await axios.post('/api/admin/approve-comment', { id: _id });
      if (data.success) {
        toast.success(data.message);
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteComment = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      const { data } = await axios.post('/api/admin/delete-comment', { id: _id });
      if (data.success) {
        toast.success(data.message);
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <tr className="border-t border-gray-700/50 hover:bg-white/5 transition-colors">
      {/* Comment Info */}
      <td className="px-4 py-3 text-left text-[var(--color-base)]">
        <p><b className="text-gray-400">Blog:</b> {blog?.title || 'Unknown'}</p>
        <p><b className="text-gray-400">Name:</b> {name}</p>
        <p><b className="text-gray-400">Comment:</b> {content}</p>
      </td>

      {/* Date */}
      <td className="px-4 py-3 text-left text-gray-400 max-sm:hidden">
        {commentDate.toLocaleDateString()}
      </td>

      {/* Actions */}
      <td className="px-4 py-3 text-left">
        <div className="flex items-center gap-4">
          {!isApproved ? (
            <button
              onClick={approveComment}
              aria-label="Approve Comment"
              className="border border-gray-700/50 px-3 py-1 rounded text-[var(--color-base)] hover:bg-white/5 transition"
            >
              Approve
            </button>
          ) : (
            <p className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
              Approved
            </p>
          )}
          <button
            onClick={deleteComment}
            aria-label="Delete Comment"
            className="hover:scale-110 transition-transform"
          >
            <img src={assets.bin_icon} alt="Delete" className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CommentTableItem;
