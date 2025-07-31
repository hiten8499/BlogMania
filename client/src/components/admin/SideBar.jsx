import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';

const menuItems = [
  { to: '/admin', icon: assets.home_icon, label: 'Dashboard' },
  { to: '/admin/addBlog', icon: assets.add_icon, label: 'Add Blog' },
  { to: '/admin/listBlog', icon: assets.list_icon, label: 'Blog List' },
  { to: '/admin/comments', icon: assets.comment_icon, label: 'Comments' },
  { to: '/admin/subscribers', icon: assets.user_icon, label: 'Subscribers' },
];

const SideBar = () => {
  return (
    <div className="flex flex-col border-r border-gray-200 min-h-full pt-6 bg-white">
      {menuItems.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/admin'}
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer transition 
            ${isActive ? 'bg-primary/10 border-r-4 border-primary' : ''}`
          }
        >
          <img src={icon} alt={`${label} icon`} className="w-5 min-w-5" />
          <p className="hidden md:inline-block">{label}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default SideBar;
