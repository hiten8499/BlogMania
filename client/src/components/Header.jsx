import React, { useRef } from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const Header = () => {
  const { setInput, input } = useAppContext();
  const inputRef = useRef();

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setInput(inputRef.current.value);
  };

  const onClear = () => {
    setInput('');
    inputRef.current.value = '';
  };

  return (
    <div className="relative px-6 sm:px-16 xl:px-24">
      <div className="text-center mt-20 mb-12">
        {/* Badge */}
        <div className="inline-flex items-center justify-center gap-2 px-6 py-1.5 mb-4 border border-red-600/40 bg-red-600/10 rounded-full text-sm text-red-500">
          <p>New: AI features integrated</p>
          <img src={assets.star_icon} alt="star_icon" className="w-3" />
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl font-semibold leading-snug text-white">
         Welcome to  <span className="text-red-500">Blog-Admin</span><br className="hidden sm:block" />
          Where Ideas meets Feedback.

        </h1>

        {/* Description */}
        <p className="my-6 sm:my-8 max-w-2xl mx-auto text-sm sm:text-base text-gray-400">
          This is the space to share, reflect, and express. Whether it's one line or a full story, 
          words belong here..
        </p>

        {/* Search Form */}
        <form
          onSubmit={onSubmitHandler}
          className="flex items-center justify-between max-w-lg mx-auto border border-gray-600 bg-[#1a1a1a] rounded-md overflow-hidden"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for blogs"
            required
            className="w-full px-4 py-2 text-sm outline-none bg-transparent text-white placeholder-gray-400"
          />
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 m-1.5 rounded transition-all"
          >
            Search
          </button>
        </form>

        {/* Clear Button */}
        {input && (
          <div className="mt-4">
            <button
              onClick={onClear}
              className="border border-gray-500 text-xs text-gray-300 py-1 px-3 rounded hover:bg-gray-800 transition"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

      {/* Background Image */}
      <img
        src={assets.gradientBackground}
        alt="gradient background"
        className="absolute top-0 left-0 w-full -z-10 opacity-30"
      />
    </div>
  );
};

export default Header;
