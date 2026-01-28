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
export const getPostComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.find({ post: postId })
      .populate("user", "username fullName avatar")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
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

// Добавить комментарий
export const addComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.postId;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "The comment cannot be empty" });
    }

    const commet = await Comment.create({
      user: userId,
      post: postId,
      text,
    });

    res.status(201).json({ message: "Comment added", commet });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Уведомление при коментарии
await Notification.create({
  recipient: post.autor,
  sender: userId,
  type: "comment",
  postId,
});
