import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Newsletter = () => {
  const { axios } = useAppContext();
  const [email, setEmail] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/blog/subscribe', { email });
      toast.success('Subscribed Successfully!');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Subscription failed. Please try again.');
    }
  };

  return (
    <section className="my-28 px-4 text-center">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800">
        Never Miss a Blog!
      </h1>
      <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
        Subscribe to get the latest blogs, tech updates, and exclusive news.
      </p>

      <form
        onSubmit={handleSubscribe}
        className="mt-6 flex flex-col sm:flex-row items-center justify-center max-w-xl mx-auto gap-3 sm:gap-0"
      >
        <input
          type="email"
          aria-label="Email address"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full sm:w-auto flex-1 h-12 px-4 text-sm border border-gray-300 rounded-md sm:rounded-r-none outline-none"
        />
        <button
          type="submit"
          className="h-12 px-6 bg-primary text-white rounded-md sm:rounded-l-none hover:bg-primary/90 transition-all w-full sm:w-auto"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
};

export default Newsletter;
