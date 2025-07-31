import React from 'react';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const BlogTableItem = ({ blog, fetchBlogs, index }) => {
  const { title, createdAt, isPublished, _id } = blog;
  const blogDate = new Date(createdAt);
  const { axios } = useAppContext();

  const deleteBlog = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this blog?');
    if (!confirmDelete) return;

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
    <tr className="border-y border-gray-300">
      <th className="px-2 py-4 text-left">{index}</th>
      <td className="px-2 py-4">{title}</td>
      <td className="px-2 py-4 max-sm:hidden">{blogDate.toLocaleDateString()}</td>
      <td className="px-2 py-4 max-sm:hidden">
        <span className={isPublished ? 'text-green-600' : 'text-orange-700'}>
          {isPublished ? 'Published' : 'Unpublished'}
        </span>
      </td>
      <td className="px-2 py-4 flex items-center gap-3 text-xs">
        <button
          onClick={togglePublish}
          className="border px-2 py-1 rounded hover:bg-gray-100 transition"
        >
          {isPublished ? 'Unpublish' : 'Publish'}
        </button>
        <img
          src={assets.cross_icon}
          alt="Delete"
          onClick={deleteBlog}
          className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
        />
      </td>
    </tr>
  );
};

export default BlogTableItem;
