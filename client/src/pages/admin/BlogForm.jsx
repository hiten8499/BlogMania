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
    } catch (err) {
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
    } catch (err) {
      alert('Failed to post blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Create Blog with AI</h2>
      <input
        type="text"
        placeholder="Enter topic"
        className="border p-2 w-full mb-4 rounded"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <button
        type="button"
        onClick={handleGenerate}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate with AI'}
      </button>
      <input
        type="text"
        placeholder="Title"
        className="border p-2 w-full mb-4 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Content"
        className="border p-2 w-full mb-4 rounded"
        rows={6}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="mb-4"
        accept="image/*"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Posting...' : 'Post Blog'}
      </button>
    </form>
  );
};

export default BlogForm;
