import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import Navbar from '../components/Navbar';
import Moment from 'moment';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Blog = () => {
  const { id } = useParams();
  const { axios } = useAppContext();

  const [data, setData] = useState(null);
  const [comment, setComments] = useState([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  const fetchBlogData = async () => {
    try {
      const { data } = await axios.get(`/api/blog/${id}`);
      data.success ? setData(data.blog) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await axios.post('/api/blog/comments', { blogId: id });
      setComments(data.success ? data.comment : []);
    } catch (error) {
      setComments([]);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/blog/add-comment', {
        blog: id,
        name,
        content,
      });
      if (data.success) {
        toast.success(data.message);
        setName('');
        setContent('');
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchBlogData();
    fetchComments();
  }, []);

  if (!data) return <Loader />;

  return (
    <div className="relative bg-gray-950 text-gray-100">
      <img
        src={assets.gradientBackground}
        alt="background"
        className="absolute -top-20 -z-10 w-full opacity-20"
      />

      <Navbar />

      {/* Blog Header */}
      <div className="text-center mt-20 px-4">
        <p className="text-primary py-4 font-medium">
          Published on {Moment(data.createdAt).format('MMMM Do YYYY')}
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold max-w-3xl mx-auto text-white">
          {data.title}
        </h1>
        <h2 className="my-5 max-w-xl mx-auto text-gray-400 text-base sm:text-lg">
          {data.subTitle}
        </h2>
        <p className="inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/40 bg-primary/10 text-primary">
          Hiten Purohit
        </p>
      </div>

      {/* Blog Content */}
      <div className="px-4 sm:px-8 max-w-5xl mx-auto my-10">
        <img
          src={data.image}
          alt="blog"
          className="w-full rounded-3xl mb-6 object-cover max-h-[450px]"
        />

        <div
          className="rich-text max-w-3xl mx-auto"
          dangerouslySetInnerHTML={{ __html: data.description }}
        />

        {/* Comments Section */}
        <div className="mt-14 mb-10 max-w-3xl mx-auto">
          <p className="font-semibold text-lg mb-4">Comments ({comment.length})</p>
          <div className="flex flex-col gap-4">
            {comment.map((item, index) => (
              <div
                key={index}
                className="relative bg-white/5 border border-white/10 p-4 rounded"
              >
                <div className="flex items-center gap-2 mb-2 text-white">
                  <img src={assets.user_icon} alt="" className="w-6 h-6 object-cover" />
                  <p className="font-medium">{item.name}</p>
                </div>
                <p className="text-sm text-gray-300 ml-8">{item.content}</p>
                <div className="absolute right-4 bottom-3 text-xs text-gray-500">
                  {Moment(item.createdAt).fromNow()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Comment Section */}
        <div className="max-w-3xl mx-auto">
          <p className="font-semibold mb-4 text-lg">Add Your Comment</p>
          <form onSubmit={addComment} className="flex flex-col gap-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Name"
              required
              className="w-full p-2 border border-gray-700 bg-gray-900 text-white rounded outline-none"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Comment"
              required
              className="w-full p-2 border border-gray-700 bg-gray-900 text-white rounded outline-none h-40"
            ></textarea>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 m-1.5 rounded transition-allx x"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Share Section */}
        <div className="text-center mt-10">
          <p className="font-semibold mb-4 text-lg">Share this Article on Social Media</p>
          <div className="flex justify-center gap-6 flex-wrap">
            <img src={assets.facebook_icon} alt="facebook" width={40} />
            <img src={assets.twitter_icon} alt="twitter" width={40} />
            <img src={assets.googleplus_icon} alt="google plus" width={40} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
