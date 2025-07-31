import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-950">
      <div
        className="animate-spin rounded-full h-16 w-16 border-4 border-t-red-600 border-gray-700"
        role="status"
        aria-label="Loading"
      ></div>
    </div>
  );
};

export default Loader;
