import Like from "../models/likeModel.js";
import Notification from "../models/notificationModel.js";
import Post from "../models/postModel.js";

// Добавить или убрать лайк
export const toggleLike = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;
    const existingLike = await Like.findOne({ user: userId, post: postId });

    if (existingLike) {
      await existingLike.deleteOne();
      return res.json({ message: "Like is deleted" });
    }

    await Like.create({ user: userId, post: postId });

    // Уведомление при лайке
    const post = await Post.findById(postId);
    if (post && post.autor.toString() !== userId.toString()) {
      await Notification.create({
        recipient: post.autor,
        sender: userId,
        type: "like",
        postId,
      });
    }

    res.json({ message: "Like added" });
  } catch (error) {
    console.error("Lice error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Получить все лайки
export const getPostLikes = async (req, res) => {
  try {
    const postId = req.params.postId;
    const likes = await Like.find({ post: postId }).populate(
      "user",
      "username fullname avatar",
    );

    res.json(likes);
  } catch (error) {
    console.error("Like error:", error);

    res.status(500).json({ message: "Server error", error });
  }
};
