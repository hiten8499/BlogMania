
import jwt from 'jsonwebtoken'
import Blog from '../models/Blogs.js';
import Comment from '../models/Comment.js';
import Subscribe from '../models/Subscribe.js';

export const adminLogin=async (req,res) => {
    try {
        const {email,password}=req.body;

        if(email !==process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.json({success:false,message:"Invalid Credentials"})
        }
        const token=jwt.sign({email},process.env.JWT_SECRET)
        res.json({success:true,token})

    } catch (error) {
         res.json({success:false,message:error.message})
    }
}

export const getAllBlogsAdmin=async (req,res) => {
    try {
        const blogs= await Blog.find({}).sort({createdAt:-1})
        res.json({success:true,blogs})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}


export const deleteBlogById = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ success: false, message: "Blog ID is required" });

        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

        res.status(200).json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllComments =async (req,res) => {
    try {
        const comments=await Comment.find({}).populate("blog").sort({createdAt:-1})
       res.json({ success: true, comments }); // ✅ clearer structure
    } catch (error) {
     res.json({success:false,message:error.message})   
    }
}

export const getDashboard =async (req,res) => {
    try {
        const recentBlogs=await Blog.find({}).sort({createdAt:-1}).limit(5)
        const blogs= await Blog.countDocuments()
        const comments = await Comment.countDocuments()
        const drafts=await Blog.countDocuments({isPublished:false})

        const dashboardData={
            blogs,comments,drafts,recentBlogs
        }
        res.json({success:true,dashboardData})
    } catch (error) {
      res.json({success:false,message:error.message})   
    }
}

export const deleteCommentById=async (req,res) => {
    try {
        const {id}=req.body;
        await Comment.findByIdAndDelete(id)
        res.json({success:true,message:"Comment Deleted Successfully"})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

export const approveById = async (req, res) => {
    try {
        const { id } = req.body;
        await Comment.findByIdAndUpdate(id, { isApproved: true });
        res.json({ success: true, message: "Comment status Updated" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscribe.find().sort({ createdAt: -1 });
    res.json({success: true,subscribers});
  } 
  catch (error) {
    res.json({success: false,message: error.message});
  }
};

// export const deleteSubscriber = async (req, res) => {
//   try {
//     const { id } = req.body;
//     await Subscribe.findByIdAndDelete(id);
//     res.json({ success: true, message: "Subscriber deleted successfully" });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

