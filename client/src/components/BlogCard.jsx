import React from 'react';
import { useNavigate } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  if (!blog) return null;
  const { title, description, category, image, _id } = blog;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/blog/${_id}`)}
      className="w-full bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer"
    >
      <div className="w-full aspect-video overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="px-5 pt-4 pb-6">
        <span className="inline-block bg-red-700/10 text-red-500 text-xs px-3 py-1 rounded-full mb-3 tracking-wide uppercase">
          {category}
        </span>
        <h5 className="text-lg font-semibold text-gray-100 mb-2 truncate">
          {title}
        </h5>
        <p
          className="text-sm text-gray-400"
          dangerouslySetInnerHTML={{ __html: description.slice(0, 80) }}
        />
      </div>
    </div>
  );
};

export default BlogCard;
