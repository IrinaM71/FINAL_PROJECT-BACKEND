//Контролллеры комментариев обрабатывают операции, связанные с созданием, получением,
//обновлением и удалением комментариев к постам. Вот основные функции, которые обычно
//включаются в commentController.js:
import Comment from "../models/Comment.js";

// Создание комментария
export const createComment = async (req, res) => {
  const { postId, content } = req.body;
  try {
    const comment = new Comment({
      post: postId,
      content: content,
      author: req.user.id,
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Получение комментариев для поста
export const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate(
      "author",
      "username"
    );
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Обновление комментария
export const updateComment = async (req, res) => {
  const { content } = req.body;
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.author.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    comment.content = content || comment.content;
    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Удаление комментария
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.author.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await comment.remove();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Получение всех комментариев
export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate("author", "username");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
