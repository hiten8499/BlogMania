import React from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
  const { navigate, token } = useAppContext();

  return (
    <header className="flex justify-between items-center py-6 px-6 sm:px-20 xl:px-32 border-b border-white/10 bg-gray-950 text-white">
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="logo"
        className="w-36 sm:w-44 cursor-pointer"
      />

      <button
        // onClick={() => navigate('/admin')}
        className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-full text-sm tracking-wide font-semibold hover:bg-red-700 transition"
      >
        {token ? 'Dashboard' : 'Admin Login'}
        <img src={assets.arrow} className="w-3" alt="arrow" />
      </button>
    </header>
  );
};

export default Navbar;
