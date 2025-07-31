import React, { useState, useMemo } from 'react';
import { assets, blog_data, blogCategories } from '../assets/assets';
import { motion } from 'framer-motion';
import BlogCard from './BlogCard';
import { useAppContext } from '../context/AppContext';

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const { blogs, input } = useAppContext();

  const filteredBlogs = useMemo(() => {
    if (!Array.isArray(blogs)) return [];

    return blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(input.toLowerCase()) ||
        blog.category.toLowerCase().includes(input.toLowerCase());

      const matchesCategory = menu === "All" || blog.category.toLowerCase() === menu.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [blogs, input, menu]);

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex justify-center gap-4 sm:gap-8 my-10 relative flex-wrap">
        {blogCategories.map((item) => (
          <div key={item} className="relative">
            <button
              onClick={() => setMenu(item)}
              className={`relative z-10 px-4 py-1 rounded-full transition 
              duration-200 cursor-pointer 
              ${menu === item ? 'text-white' : 'text-gray-500'}`}
            >
              {item}
              {menu === item && (
                <motion.div
                  layoutId="underline"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute inset-0 bg-primary rounded-full z-0"
                />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4  
        gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 text-lg">
            No blogs found.
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
