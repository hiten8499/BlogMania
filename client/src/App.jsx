import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Blog from './pages/Blog';
import Home from './pages/Home';
import Dashboard from './pages/admin/Dashboard';
import AddBlog from './pages/admin/AddBlog';
import ListBlog from './pages/admin/ListBlog';
import Comments from './pages/admin/Comments';
import Login from './components/admin/Login';
import Subscriber from './pages/admin/Subscriber';
import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/AppContext';
import Layout from './pages/admin/Layout';
import 'quill/dist/quill.snow.css';

const App = () => {
  const { token } = useAppContext();

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-100 font-sans">
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/blog/:id' element={<Blog />} />
        <Route path='/admin' element={token ? <Layout /> : <Login />}>
          <Route index element={<Dashboard />} />
          <Route path='addBlog' element={<AddBlog />} />
          <Route path='listBlog' element={<ListBlog />} />
          <Route path='comments' element={<Comments />} />
          <Route path='subscribers' element={<Subscriber />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
