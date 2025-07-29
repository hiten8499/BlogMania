import fs from 'fs';
import imagekit from '../configs/imageKit.js';
import Blog from '../models/Blogs.js';
import { getActiveResourcesInfo } from 'process';
import Comment from '../models/Comment.js';
import main from '../configs/gemini.js';

export const addBLog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
    const imageFile = req.file;

    if (!title || !subTitle || !description || !category || !isPublished) {
      return res.json({ success: false, message: "Missing Required Fields" });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);

    // Upload Image to Imagekit
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs"
    });

    // Optimization through ImageKit URL transformation
    const optimizedUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: 'auto' },
        { format: 'webp' },
        { width: '1280' }
      ]
    });

    const image = optimizedUrl;
    await Blog.create({ title, subTitle, description, category, image, isPublished });

    res.json({ success: true, message: "Blog Added Successfully" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    console.log("All blog called");
    const blog = await Blog.find({ isPublished: true }); 
    res.json({ success: true, blogs: blog });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const getBlogById = async (req, res) => {
  try {
    const { blogid } = req.params;
    const blog = await Blog.findById(blogid);
    if (!blog) {
      return res.json({ success: false, message: "Blog Not Found" });
    }
    res.json({ success: true, blog });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;  
    await Blog.findByIdAndDelete(id);

    // Also delete related comments
    await Comment.deleteMany({ blog: id });

    return res.json({ success: true, message: "Blog Deleted Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const togglePublished = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);
    blog.isPublished = !blog.isPublished;
    await blog.save();
    return res.json({ success: true, message: "Blog status Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body;
    await Comment.create({ blog, name, content });
    res.json({ success: true, message: 'Comment Added for Review' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.body;
    const comments = await Comment.find({ blog: blogId, isApproved: true }).sort({ createdAt: -1 });
    
    res.json({ success: true, comment: comments }); // ✅ Changed from message → comment
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const generateContent =async (req,res) => {
  try {

    const{prompt} =req.body;
   const content= await main(prompt + 
    ' Generate a blog content for this topic in simple text format ')
    res.json({success:true,content})
  } catch (error) {
    res.json({success:false,message:error.message})
  }
}

