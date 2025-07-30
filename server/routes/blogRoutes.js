import express from 'express';
import { addBLog, addComment, deleteBlogById, generateContent, getAllBlogs, getBlogById, getBlogComments, handleSubscribe, togglePublished } from '../controllers/blogController.js';
import upload from '../middleware/multer.js';
import auth from '../middleware/auth.js';

const blogRouter =express.Router();

blogRouter.post("/add",upload.single('image'), auth, addBLog)
blogRouter.get('/all',getAllBlogs)
blogRouter.get('/:blogid',getBlogById)
blogRouter.post('/delete',auth,deleteBlogById)
blogRouter.post('/toggle-publish',auth,togglePublished)
blogRouter.post('/add-comment',addComment)
blogRouter.post('/comments',getBlogComments)
blogRouter.post('/generate',auth,generateContent)
blogRouter.post('/subscribe',handleSubscribe)

export default blogRouter;