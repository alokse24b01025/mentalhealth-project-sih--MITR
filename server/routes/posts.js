const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');

// 1. Configure File Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists in your server root
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });

// 2. GET: Fetch all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// 3. POST: Create post with Photo/Video
router.post('/create', upload.single('media'), async (req, res) => {
  try {
    const newPost = new Post({
      content: req.body.content,
      authorEmail: req.body.authorEmail || "Anonymous",
      image: req.file ? `/uploads/${req.file.filename}` : (req.body.image || null) // Save relative path or direct external URL
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
});

// 4. PUT: Upvote
router.put('/:id/upvote', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.likes = (post.likes || 0) + 1;
    await post.save();
    res.json(post);
  } catch (err) { res.status(500).json(err); }
});

// 5. POST: Comment
router.post('/:id/comment', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.comments.push({ text: req.body.text, date: new Date() });
    await post.save();
    res.json(post);
  } catch (err) { res.status(500).json(err); }
});

module.exports = router;