
import express from 'express';

const router = express.Router();

router.post('/generate', async (req, res) => {
  const { topic } = req.body;

  // Simulated AI-generated content
  res.json({
    title: `AI Generated Title for ${topic}`,
    content: `This is an AI-generated blog post content on the topic: ${topic}.`
  });
});

export default router;
