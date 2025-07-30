import fs from 'fs';
import imagekit from '../configs/imageKit.js';
import Blog from '../models/Blogs.js';
import { getActiveResourcesInfo } from 'process';
import Comment from '../models/Comment.js';
import main from '../configs/gemini.js';
import nodemailer from 'nodemailer';
import { format } from 'path';
import Subscribe from '../models/Subscribe.js';
import { subscribe } from 'diagnostics_channel';

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

    // Save blog to DB
    const newBlog = await Blog.create({ title, subTitle, description, category, image, isPublished });

    // Notify subscribers via email (only after blog is saved)
    try {
      const subscribers = await Subscribe.find({});
      if (subscribers.length > 0) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: MAIL_USERNAME,
            pass: MAIL_PASSWORD
          }
        });

        const blogUrl = `/${newBlog._id}`;

        const mailOptions = {
          from: 'purohithiten49@gmail.com',
          to: subscribers.map(s => s.email),
          subject: `New Blog Published: ${title}`,
          html: `
            <h2>${title}</h2>
            <p>${subTitle}</p>
            <p><a href="${blogUrl}">Click here to read the blog</a></p>
            <br/>
            <p>Thanks for subscribing to BlogMania!</p>
          `
        };

        await transporter.sendMail(mailOptions);
      }
    } catch (mailError) {
      console.error("Mail sending failed:", mailError.message);
      // Don't block blog creation on mail failure
    }

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

export const  handleSubscribe=async (req,res) => {
  const {email}=req.body;
  
  if(!email) return res.json({success:false,message:'Email is Required'});
    try {
      const alreadyExist=await Subscribe.findOne({email});
      if (alreadyExist) {
        return res.json({success:false,message:"Email Already Subscribed"})
      }
      await Subscribe.create({email});
        const transporter= nodemailer.createTransport({

          service:'gmail',
          auth:{
            user:'purohithiten49@gmail.com',
            pass:'kmduawzfyvakdyvi'
          }
        });
        const mail={
          from:'purohithiten49@gmail.com',
          to:email,
          subject:'Thanks for Subscribing ! ',
          html:`
           <h2> Welcome to BlogMania! </h2>
           <p> Thanks for Subsribing. We will notify you about new content !</p>
             <p> Stay Tuned </p>
          `
        };
        await transporter.sendMail(mail);
        return res.json({success:false,message:' Subscription Successful. Email Sent.'})
    } catch (error) {
         console.log(error)
        return res.json({success:false,message:'Something Went Wrong '})
    }
}

