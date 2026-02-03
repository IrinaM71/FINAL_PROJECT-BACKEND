import Post from "../models/postModel.js";



-
// FEED — все посты (лента)

export const getFeed = async (_req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username fullName avatar")
      .populate({
        path: "comments",
        populate: { path: "author", select: "username avatar" },
      })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error("Feed error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username fullName avatar")
      .populate({
        path: "comments",
        populate: { path: "author", select: "username avatar" },
      })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error("Get all posts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// Все посты конкретного пользователя

export const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;

    const posts = await Post.find({ author: userId })
      .populate("author", "username fullname avatar")
      .populate({
        path: "comments",
        populate: { path: "author", select: "username avatar" },
      })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error("User posts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Создание поста

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const base64Image = req.file.buffer.toString("base64");
    const image = `data:${req.file.mimetype};base64,${base64Image}`;

    const post = await Post.create({
      author: req.user._id,
      text,
      image,
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Получение поста по ID

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username fullname avatar")
      .populate({
        path: "comments",
        populate: { path: "author", select: "username avatar" },
      });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Удаление поста

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "No permission to delete" });
    }

    await post.deleteOne();
    res.json({ message: "Post removed" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Обновление поста

export const updatePost = async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "No update rights" });
    }

    if (text) post.text = text;

    if (req.file) {
      const base64Image = req.file.buffer.toString("base64");
      post.image = `data:${req.file.mimetype};base64,${base64Image}`;
    }

    await post.save();
    res.json(post);
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
