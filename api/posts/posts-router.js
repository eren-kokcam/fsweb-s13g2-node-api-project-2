const express = require('express');
const Post = require('./posts-model');

const router = express.Router();

// GET /api/posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Gönderiler alınamadı" });
  }
});

// GET /api/posts/:id
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
      res.status(200).json(post);
    }
  } catch (err) {
    res.status(500).json({ message: "Gönderi bilgisi alınamadı" });
  }
});

// POST /api/posts
router.post('/', async (req, res) => {
  try {
    const { title, contents } = req.body;
    if (!title || !contents) {
      res.status(400).json({ message: "Lütfen gönderi için bir title ve contents sağlayın" });
    } else {
      const { id } = await Post.insert({ title, contents });
      const newPost = await Post.findById(id);
      res.status(201).json(newPost);
    }
  } catch (err) {
    res.status(500).json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
  }
});

// PUT /api/posts/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, contents } = req.body;
    if (!title || !contents) {
      res.status(400).json({ message: "Lütfen gönderi için title ve contents sağlayın" });
    } else {
      const post = await Post.findById(req.params.id);
      if (!post) {
        res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
      } else {
        await Post.update(req.params.id, { title, contents });
        const updatedPost = await Post.findById(req.params.id);
        res.status(200).json(updatedPost);
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Gönderi bilgileri güncellenemedi" });
  }
});

// DELETE /api/posts/:id
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Belirtilen ID li gönderi bulunamadı" });
    } else {
      await Post.remove(req.params.id);
      res.status(200).json(post);
    }
  } catch (err) {
    res.status(500).json({ message: "Gönderi silinemedi" });
  }
});

// GET /api/posts/:id/comments
router.get('/:id/comments', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Girilen ID'li gönderi bulunamadı." });
    } else {
      const comments = await Post.findPostComments(req.params.id);
      res.status(200).json(comments);
    }
  } catch (err) {
    res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
  }
});

module.exports = router;
