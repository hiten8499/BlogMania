import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import BlogTableItem from '../../components/admin/BlogTableItem';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    blogs: 0,
    comments: 0,
    drafts: 0,
    recentBlogs: [],
  });

  const { axios } = useAppContext();

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get('/api/admin/dashboard');
      data.success
        ? setDashboardData(data.dashboardData)
        : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="flex-1 p-4 md:p-10 bg-[var(--color-bg)] text-[var(--color-base)]">
      {/* Stats Cards */}
      <div className="flex flex-wrap gap-4">
        {/* Blogs */}
        <div className="flex items-center gap-4 bg-[#1a1a1a] p-4 min-w-58 rounded-lg shadow border border-gray-800 hover:border-[var(--color-primary)] transition-all hover:scale-105">
          <img src={assets.dashboard_icon_1} alt="" />
          <div>
            <p className="text-xl font-semibold">{dashboardData.blogs}</p>
            <p className="text-gray-400 text-sm">Blogs</p>
          </div>
        </div>

        {/* Comments */}
        <div className="flex items-center gap-4 bg-[#1a1a1a] p-4 min-w-58 rounded-lg shadow border border-gray-800 hover:border-[var(--color-primary)] transition-all hover:scale-105">
          <img src={assets.dashboard_icon_2} alt="" />
          <div>
            <p className="text-xl font-semibold">{dashboardData.comments}</p>
            <p className="text-gray-400 text-sm">Comments</p>
          </div>
        </div>

        {/* Drafts */}
        <div className="flex items-center gap-4 bg-[#1a1a1a] p-4 min-w-58 rounded-lg shadow border border-gray-800 hover:border-[var(--color-primary)] transition-all hover:scale-105">
          <img src={assets.dashboard_icon_3} alt="" />
          <div>
            <p className="text-xl font-semibold">{dashboardData.drafts}</p>
            <p className="text-gray-400 text-sm">Drafts</p>
          </div>
        </div>
      </div>

      {/* Latest Blogs Table */}
      <div>
        <div className="flex items-center gap-3 m-4 mt-6">
          <img src={assets.dashboard_icon_4} alt="" />
          <p className="text-lg font-medium">Latest Blogs</p>
        </div>
        <div className="relative max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-[#1a1a1a] border border-gray-800">
          <table className="w-full text-sm text-gray-400">
            <thead className="text-xs uppercase text-gray-500 border-b border-gray-700">
              <tr>
                <th scope="col" className="px-2 py-4 xl:px-6">#</th>
                <th scope="col" className="px-2 py-4">Blog Title</th>
                <th scope="col" className="px-2 py-4 max-sm:hidden">Date</th>
                <th scope="col" className="px-2 py-4 max-sm:hidden">Status</th>
                <th scope="col" className="px-2 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentBlogs.map((blog, index) => (
                <BlogTableItem
                  key={blog.id || index}
                  blog={blog}
                  fetchBlogs={fetchDashboard}
                  index={index + 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
