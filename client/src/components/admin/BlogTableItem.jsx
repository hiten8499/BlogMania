import React from 'react';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const BlogTableItem = ({ blog, fetchBlogs, index }) => {
  const { title, createdAt, isPublished, _id } = blog;
  const blogDate = new Date(createdAt);
  const { axios } = useAppContext();

  const deleteBlog = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      const { data } = await axios.post('/api/blog/delete', { id: _id });
      data.success ? toast.success(data.message) : toast.error(data.message);
      await fetchBlogs();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const togglePublish = async () => {
    try {
      const { data } = await axios.post('/api/blog/toggle-publish', { id: _id });
      data.success ? toast.success(data.message) : toast.error(data.message);
      await fetchBlogs();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <tr className="border-t border-gray-700/50 hover:bg-white/5 transition-colors">
      <td className="px-4 py-3 text-left text-[var(--color-base)]">{index}</td>
      <td className="px-4 py-3 text-left text-[var(--color-base)]">{title}</td>
      <td className="px-4 py-3 text-left text-gray-400 max-sm:hidden">
        {blogDate.toLocaleDateString()}
      </td>
      <td className="px-4 py-3 text-left max-sm:hidden">
        <span
          className={
            isPublished
              ? 'px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400'
              : 'px-2 py-1 text-xs rounded-full bg-orange-500/20 text-orange-400'
          }
        >
          {isPublished ? 'Published' : 'Unpublished'}
        </span>
      </td>
      <td className="px-4 py-3 text-left">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePublish}
            className="border border-gray-700/50 px-3 py-1 rounded text-[var(--color-base)] hover:bg-white/5 transition"
          >
            {isPublished ? 'Unpublish' : 'Publish'}
          </button>
          <button onClick={deleteBlog} className="hover:scale-110 transition-transform">
            <img src={assets.cross_icon} alt="Delete" className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BlogTableItem;
