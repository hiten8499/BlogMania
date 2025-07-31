import React from 'react';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const CommentTableItem = ({ comments, fetchComments }) => {
  const { blog, createdAt, _id, name, content, isApproved } = comments;
  const BlogDate = new Date(createdAt);
  const { axios } = useAppContext();

  const approveComment = async () => {
    try {
      const { data } = await axios.post('/api/admin/approve-comment', { id: _id });
      if (data.success) {
        toast.success(data.message);
        fetchComments();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteComment = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmDelete) return;

    try {
      const { data } = await axios.post('/api/admin/delete-comment', { id: _id });
      if (data.success) {
        toast.success(data.message);
        fetchComments();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <tr className='border-y border-gray-300'>
      <td className='px-6 py-4'>
        <p><b className='font-medium text-gray-600'>Blog:</b> {blog?.title || "Unknown"}</p>
        <p><b className='font-medium text-gray-600'>Name:</b> {name}</p>
        <p><b className='font-medium text-gray-600'>Comment:</b> {content}</p>
      </td>
      <td className='px-6 py-4 max-sm:hidden'>
        {BlogDate.toLocaleDateString()}
      </td>
      <td className='px-6 py-4'>
        <div className='inline-flex items-center gap-4'>
          {!isApproved ? (
            <button
              onClick={approveComment}
              aria-label="Approve Comment"
              className='hover:scale-110 transition-all'
            >
              <img src={assets.tick_icon} alt="Approve" className='w-5' />
            </button>
          ) : (
            <p className='text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1'>
              Approved
            </p>
          )}
          <button
            onClick={deleteComment}
            aria-label="Delete Comment"
            className='hover:scale-110 transition-all'
          >
            <img src={assets.bin_icon} alt="Delete" className='w-5' />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CommentTableItem;
