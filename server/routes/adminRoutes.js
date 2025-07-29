import express from 'express'
import { adminLogin, approveById, deletCommentById, getAllBlogsAdmin, getAllComments, getDashboard } from '../controllers/adminController.js';
import auth from '../middleware/auth.js';

const adminRouter=express.Router();

adminRouter.post("/login",adminLogin)
adminRouter.post("/comments", auth ,getAllComments)
adminRouter.get("/blogs",auth ,getAllBlogsAdmin)
adminRouter.post("/delete-comment",auth ,deletCommentById)
adminRouter.post("/approve-comment",auth ,approveById)
adminRouter.get("/dashboard",auth ,getDashboard)

export default adminRouter;