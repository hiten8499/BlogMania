import React, { useEffect, useRef, useState } from 'react';
import { assets, blogCategories } from '../../assets/assets';
import Quill from 'quill';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { parse } from 'marked';

const AddBlog = () => {
  const { axios } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [category, setCategory] = useState('Startup');
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' });
    }
  }, []);

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [image]);

  const generateContent = async () => {
    if (!title) return toast.error('Please enter the title');

    try {
      setLoading(true);
      const { data } = await axios.post('/api/blog/generate', { prompt: title });
      if (data.success) {
        quillRef.current.root.innerHTML = parse(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!quillRef.current) return toast.error("Editor not ready");

    try {
      setIsAdding(true);

      const blog = {
        title,
        subTitle,
        description: quillRef.current.root.innerHTML,
        category,
        isPublished,
      };

      const formData = new FormData();
      formData.append('blog', JSON.stringify(blog));
      formData.append('image', image);

      const { data } = await axios.post('/api/blog/add', formData);
      if (data.success) {
        toast.success(data.message);
        setTitle('');
        setSubTitle('');
        setImage(null);
        setImagePreview(null);
        quillRef.current.root.innerHTML = '';
        setCategory('Startup');
        setIsPublished(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-[var(--color-bg)] text-[var(--color-base)] h-full overflow-scroll"
    >
      <div className="bg-[var(--color-bg)] border border-gray-700/50 w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded-md">

        {/* Image Upload */}
        <p className="font-medium mb-1">Upload Thumbnail</p>
        <label htmlFor="image">
          <img
            src={!imagePreview ? assets.upload_area : imagePreview}
            className="mt-2 h-16 rounded cursor-pointer object-cover border border-gray-700/50"
            alt="Thumbnail Preview"
          />
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            hidden
            id="image"
            required
          />
        </label>

        {/* Title Input */}
        <p className="mt-4 font-medium">Blog Title</p>
        <input
          type="text"
          placeholder="Type Here"
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-700/50 outline-none rounded bg-transparent text-[var(--color-base)] placeholder-gray-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Subtitle Input */}
        <p className="mt-4 font-medium">SubTitle</p>
        <input
          type="text"
          placeholder="Type Here"
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-700/50 outline-none rounded bg-transparent text-[var(--color-base)] placeholder-gray-500"
          value={subTitle}
          onChange={(e) => setSubTitle(e.target.value)}
        />

        {/* Description Editor */}
        <p className="mt-4 font-medium">Blog Description</p>
        <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative border border-gray-700/50 rounded">
          <div ref={editorRef}></div>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 mt-2">
              <div className="w-8 h-8 rounded-full border-2 border-t-white animate-spin"></div>
            </div>
          )}
          <button
            type="button"
            disabled={loading}
            onClick={generateContent}
            className="absolute bottom-1 right-2 ml-2 text-xs text-white bg-[var(--color-primary)] px-4 py-1.5 rounded hover:bg-red-700 transition-colors"
          >
            Generate With AI
          </button>
        </div>

        {/* Category Select */}
        <p className="mt-4 font-medium">Blog Category</p>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          name="category"
          className="mt-2 px-3 py-2 border border-gray-700/50 bg-transparent text-[var(--color-base)] placeholder-gray-500 outline-none rounded"
          required
        >
          {blogCategories.map((item, index) => (
            <option key={index} value={item} className="bg-[var(--color-bg)] text-[var(--color-base)]">
              {item}
            </option>
          ))}
        </select>

        {/* Publish Checkbox */}
        <div className="flex gap-2 mt-4 items-center">
          <p>Publish Now</p>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="scale-125 cursor-pointer"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isAdding}
          className="mt-8 w-40 h-10 bg-[var(--color-primary)] hover:bg-red-700 text-white rounded cursor-pointer text-sm transition-colors"
        >
          {isAdding ? "Adding..." : "Add Blog"}
        </button>
      </div>
    </form>
  );
};

export default AddBlog;
