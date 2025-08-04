import React, { useEffect, useState } from 'react';
import BlogTableItem from '../../components/admin/BlogTableItem';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ListBlog = () => {
  const { axios } = useAppContext();
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get('/api/admin/blogs');
      if (data.success) {
        setBlogs(data.blogs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="flex-1 h-4/5 pt-5 sm:pt-12 sm:pl-16 bg-[var(--color-bg)] text-[var(--color-base)]">
      <h1 className="text-xl font-semibold mb-4 text-white">All Blogs</h1>

      <div className="relative mt-4 max-w-4xl overflow-x-auto shadow-lg rounded-lg scrollbar-hide bg-[#1a1a1a] border border-gray-700">
        <table className="w-full text-sm text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-[#121212] border-b border-gray-700">
            <tr>
              <th scope="col" className="px-2 py-4 xl:px-6">#</th>
              <th scope="col" className="px-2 py-4">Blog Title</th>
              <th scope="col" className="px-2 py-4 max-sm:hidden">Date</th>
              <th scope="col" className="px-2 py-4 max-sm:hidden">Status</th>
              <th scope="col" className="px-2 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, index) => (
              <BlogTableItem
                key={blog.id || index}
                blog={blog}
                fetchBlogs={fetchBlogs}
                index={index + 1}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListBlog;
