// /frontend/src/pages/admin/BlogForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const BlogForm = ({ onPostAdded }) => {
  const [topic, setTopic] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return alert('Enter a topic first');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/admin/generate', { topic });
      setTitle(data.title);
      setContent(data.content);
    } catch {
      alert('Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async () => {
    if (!image) return '';
    const formData = new FormData();
    formData.append('image', image);

    const { data } = await axios.post('/api/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert('Title and content are required');

    setLoading(true);
    try {
      const imageUrl = await handleUploadImage();
      const { data } = await axios.post('/api/admin/add', {
        title,
        content,
        imageUrl,
      });

      onPostAdded(data.blog);
      setTopic('');
      setTitle('');
      setContent('');
      setImage(null);
    } catch {
      alert('Failed to post blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#1a1a1a] border border-gray-700/50 p-6 rounded-lg shadow-md mb-6 text-[var(--color-base)]"
    >
      <h2 className="text-xl font-semibold mb-4 text-white">Create Blog with AI</h2>
      
      {/* Topic Input */}
      <input
        type="text"
        placeholder="Enter topic"
        className="w-full mb-4 p-2 bg-transparent border-b-2 border-gray-700 outline-none focus:border-[var(--color-primary)] text-white placeholder-gray-500"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      {/* Generate Button */}
      <button
        type="button"
        onClick={handleGenerate}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition mb-4"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate with AI'}
      </button>

      {/* Title Input */}
      <input
        type="text"
        placeholder="Title"
        className="w-full mb-4 p-2 bg-transparent border-b-2 border-gray-700 outline-none focus:border-[var(--color-primary)] text-white placeholder-gray-500"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {/* Content Textarea */}
      <textarea
        placeholder="Content"
        className="w-full mb-4 p-2 bg-transparent border border-gray-700 rounded outline-none focus:border-[var(--color-primary)] text-white placeholder-gray-500"
        rows={6}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />

      {/* Image Upload */}
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="mb-4 text-gray-400"
        accept="image/*"
      />

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-[var(--color-primary)] hover:bg-red-700 text-white px-4 py-2 rounded transition"
        disabled={loading}
      >
        {loading ? 'Posting...' : 'Post Blog'}
      </button>
    </form>
  );
};

export default BlogForm;
