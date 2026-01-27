import User from "../models/User";
import Post from "../models/postModel";

//Поиск пользователей по username или имени
export const searchUser = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ messge: "Enter a search term" });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { fullName: { $regex: query, $options: "i" } },
      ],
    }).select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({ messge: "Server error", error });
  }
};

// Случайные посты
export const explorePosts = async (req, res) => {
  try {
    const posts = await Post.aggregate([
      { $sample: { size: 30 } }, //выбираем 30 случайных постов
    ]);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ messge: "Server error", error });
  }
};
