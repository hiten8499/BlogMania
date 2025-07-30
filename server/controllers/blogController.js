import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

import imagekit from '../configs/imageKit.js';
import Blog from '../models/Blogs.js';
import Comment from '../models/Comment.js';
import main from '../configs/gemini.js';
import nodemailer from 'nodemailer';
import Subscribe from '../models/Subscribe.js';

// ========== ADD BLOG ==========
export const addBLog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
    const imageFile = req.file;

    if (!title || !subTitle || !description || !category || !isPublished) {
      return res.json({ success: false, message: "Missing Required Fields" });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);

    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs"
    });

    const optimizedUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: 'auto' },
        { format: 'webp' },
        { width: '1280' }
      ]
    });

    const image = optimizedUrl;

    const newBlog = await Blog.create({ title, subTitle, description, category, image, isPublished });

    // ===== Send Email to Subscribers =====
    try {
      const subscribers = await Subscribe.find({});
      console.log("Subscribers found:", subscribers.length);

      if (subscribers.length > 0) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
          }
        });

        const blogUrl = `https://blog-mania-pi.vercel.app/${newBlog._id}`; 

        const mailOptions = {
          from: `"BlogMania" <${process.env.MAIL_USERNAME}>`,
          to: subscribers.map(s => s.email),
          subject: `New Blog Published: ${title}`,
          html: `
            <h2>${title}</h2>
            <p>${subTitle}</p>
            <p><a href="${blogUrl}">Click here to read the full blog</a></p>
            <br/>
            <p>Thanks for subscribing to <strong>BlogMania</strong>!</p>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log("Notification emails sent to subscribers.");
      }
    } catch (mailError) {
      console.error("Mail sending failed:", mailError.message);
    }

    res.json({ success: true, message: "Blog Added Successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ========== GET ALL BLOGS ==========
export const getAllBlogs = async (req, res) => {
  try {
    const blog = await Blog.find({ isPublished: true });
    res.json({ success: true, blogs: blog });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ========== GET BLOG BY ID ==========
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

// ========== DELETE BLOG BY ID ==========
export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;
    await Blog.findByIdAndDelete(id);
    await Comment.deleteMany({ blog: id });

    return res.json({ success: true, message: "Blog Deleted Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ========== TOGGLE PUBLISHED ==========
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

// ========== ADD COMMENT ==========
export const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body;
    await Comment.create({ blog, name, content });
    res.json({ success: true, message: 'Comment Added for Review' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ========== GET COMMENTS ==========
export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.body;
    const comments = await Comment.find({ blog: blogId, isApproved: true }).sort({ createdAt: -1 });

    res.json({ success: true, comment: comments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ========== GENERATE BLOG CONTENT ==========
export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    const content = await main(prompt + ' Generate a blog content for this topic in simple text format ');
    res.json({ success: true, content });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ========== HANDLE SUBSCRIBE ==========
export const handleSubscribe = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.json({ success: false, message: 'Email is Required' });

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!isValidEmail) return res.json({ success: false, message: 'Invalid Email Format' });

  try {
    const alreadyExist = await Subscribe.findOne({ email });
    if (alreadyExist) {
      return res.json({ success: false, message: "Email Already Subscribed" });
    }

    await Subscribe.create({ email });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
      }
    });

    const mail = {
      from: `"BlogMania" <${process.env.MAIL_USERNAME}>`,
      to: email,
      subject: 'Thanks for Subscribing!',
      html: `
        <h2>Welcome to BlogMania!</h2>
        <p>Thanks for subscribing. We will notify you about new content!</p>
        <p>Stay tuned 🚀</p>
      `
    };

    await transporter.sendMail(mail);
    return res.json({ success: true, message: 'Subscription Successful. Email Sent.' });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: 'Something Went Wrong' });
  }
};
