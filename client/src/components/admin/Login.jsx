import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { axios, setToken } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('/api/admin/login', { email, password });

      if (data.success) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        axios.defaults.headers.common['Authorization'] = data.token;
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[var(--color-bg)]">
      <div className="w-full max-w-sm p-6 mx-4 border border-gray-700/50 shadow-xl shadow-black/30 rounded-lg bg-[#1a1a1a]">
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-[var(--color-base)]">
            <span className="text-[var(--color-primary)]">Admin</span> Login
          </h1>
          <p className="text-sm text-gray-400">Enter your credentials to access</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full text-[var(--color-base)]">
          <div className="mb-6">
            <label htmlFor="email" className="block mb-1 font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border-b-2 border-gray-700 bg-transparent outline-none focus:border-[var(--color-primary)] text-[var(--color-base)] placeholder-gray-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-1 font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border-b-2 border-gray-700 bg-transparent outline-none focus:border-[var(--color-primary)] text-[var(--color-base)] placeholder-gray-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 font-semibold bg-[var(--color-primary)] text-white rounded hover:bg-red-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
