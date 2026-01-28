import Follow from "../models/followModel.js";
import Notification from "../models/notificationModel.js";

// Подписка на пользователя
export const followUser = async (req, res) => {
  try {
    const followerId = req.user._id;
    const followingId = req.params.userid;

    if (followerId.toString() === followingId) {
      return res
        .status(400)
        .json({ message: "You can't subscribe to yourself" });
    }

    const existingFollow = await Follow.findOne({
      follower: followerId,
      following: followingId,
    });

    if (existingFollow) {
      return res.status(400).json({ message: "You are already subscribed" });
    }

    await Follow.create({
      follower: followerId,
      following: followingId,
    });

    // Уведомление о подписке
    await Notification.create({
      recipient: followingId,
      sender: followerId,
      type: "follow",
    });

    res.json({ message: "You subscribed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Отписка от пользователя
export const unfollowUser = async (req, res) => {
  try {
    const followerId = req.user._id;
    const followingId = req.params.userid;

    const follow = await Follow.findOne({
      follower: followerId,
      following: followingId,
    });

    if (!follow) {
      return res.status(400).json({ message: "You are not subscribed" });
    }

    await follow.deleteOne();
    res.json({ message: "You unsubscribed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Получение подписчиков пользователя
export const getFollowers = async (req, res) => {
  try {
    const userId = req.params.userId;

    const followers = await Follow.find({ following: userId }).populate(
      "follower",
      "username fullName avatar",
    );

    res.json(followers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Получение подписок пользователя
export const getFollowing = async (req, res) => {
  try {
    const userId = req.params.userId;

    const following = await Follow.find({ follower: userId }).populate(
      "following",
      "username fullName avatar",
    );

    res.json(following);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
