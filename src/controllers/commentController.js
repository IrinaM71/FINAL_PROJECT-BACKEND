import Comment from "../models/commentModel.js";
import Post from "../models/postModel.js";
import Notification from "../models/notificationModel.js";

// Создать комментарий
export const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;
    const userId = req.user._id;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "The comment cannot be empty" });
    }

    // Проверяем, существует ли пост
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Создаём комментарий
    const comment = await Comment.create({
      post: postId,
      author: userId,
      content,
    });

    // Создаём уведомление, если автор поста — не тот же пользователь
    if (post.author.toString() !== userId.toString()) {
      await Notification.create({
        recipient: post.author,
        sender: userId,
        type: "comment",
        postId,
        commentId: comment._id,
      });
    }

    res.status(201).json(comment);
  } catch (error) {
    console.error("Create comment error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Получить комментарии поста
export const getPostComments = async (req, res) => {
  try {
    const postId = req.params.postId;

    const comments = await Comment.find({ post: postId })
      .populate("author", "username fullname avatar")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Обновить комментарий
export const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const commentId = req.params.id;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: "No rights to edit" });
    }

    comment.content = content || comment.content;
    await comment.save();

    res.json(comment);
  } catch (error) {
    console.error("Update comment error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Удалить комментарий
export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: "No permission to delete" });
    }

    await comment.deleteOne();

    res.json({ message: "Comment deleted" });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Получить все комментарии (например, для админки)
export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("author", "username fullname avatar")
      .populate("post", "title");

    res.json(comments);
  } catch (error) {
    console.error("Get all comments error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
