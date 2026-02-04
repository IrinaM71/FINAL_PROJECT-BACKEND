import Post from "../models/postModel.js";

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

export const getAllPosts = async (_req, res) => {
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

export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate("author", "username fullName avatar")
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

export const createPost = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const base64Image = req.file.buffer.toString("base64");
    const image = `data:${req.file.mimetype};base64,${base64Image}`;

    const post = await Post.create({
      author: req.user._id,
      text: req.body.text,
      image,
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username fullName avatar")
      .populate({
        path: "comments",
        populate: { path: "author", select: "username avatar" },
      });

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

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

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "No update rights" });
    }

    if (req.body.text) post.text = req.body.text;

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
