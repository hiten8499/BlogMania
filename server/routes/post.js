// /backend/routes/posts.js
import express from 'express';
import Post from '../models/Post.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/add', auth, async (req, res) => {
  const { title, content, imageUrl } = req.body;
  const post = new Post({ title, content, imageUrl });
  await post.save();
  res.json({ post });
});

router.get('/', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json({ posts });
});

export default router;
