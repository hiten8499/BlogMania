import express from 'express';
import { addBLog } from '../controllers/blogController.js';
import upload from '../middleware/multer.js';
import auth from '../middleware/auth.js';

const blogRouter =express.Router();

blogRouter.post("/add",upload.single('image'), auth, addBLog)

export default blogRouter;