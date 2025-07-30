import express from 'express'
import { adminLogin, approveById , deleteCommentById, deleteSubscriber, getAllBlogsAdmin, getAllComments, getAllSubscribers, getDashboard } from '../controllers/adminController.js';
import auth from '../middleware/auth.js';
const adminRouter=express.Router();

adminRouter.post("/login",adminLogin)
adminRouter.get("/comments", auth ,getAllComments)
adminRouter.get("/blogs",auth ,getAllBlogsAdmin)
adminRouter.post("/delete-comment",auth,deleteCommentById)
adminRouter.post("/approve-comment",auth ,approveById)
adminRouter.get("/dashboard",auth ,getDashboard)
adminRouter.get('/subscribers',auth,getAllSubscribers)
// adminRouter.post('subscribers/delete',auth,deleteSubscriber)

export default adminRouter;