import Post from "../models/postModel.js";

// Получение всех постов
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "userName fullName avatar")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Получение всех постов конкретного пользователя
export const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Создание поста
export const createPost = async (req, res) => {
  try {
    const { description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }
    const base64Image = req.file.buffer.toString("base64");
    const image = `data:${req.file.mimetype};base64,${base64Image}`;

    const post = await Post.create({
      author: req.user._id,
      description,
      image,
    });
    res.status(201).json({ message: "Post created" });
  } catch (error) {
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
    res.status(500).json({ message: "Server error" });
  }
};

// Получение конкретного поста по ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username fullname avatar",
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Обновление поста
export const updatePost = async (req, res) => {
  const { description } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "No update reghts" });
    }
    if (description) post.description = description;

    if (req.file) {
      const base64Image = req.file.buffer.toString("base64");
      post.image = `data:${req.file.mimetype};base64, ${base64Image}`;
    }

    await post.save();
    res.json({ message: "Post updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
