import mongoose from "mongoose";
import Like from "../models/likeModel";


// Добавить или убрать лайк
export const toggleLike = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user._id;
         const existingLike = await Like.findOne({user: userId, post: postId});

         if (existingLike) {
            await existingLike.deleteOne();
            return res.json({ message: "Like is delited"});
         }

         await Like.create({user: userId, post: postId});
         res.json({message: "Like added"});
    } catch (error) {
        console.error("Lice error:", error);
        res.status(500).json({message: "Server error", error});
    }
};

// Получить все лайки
export const getPostLikes = async (req, res) => {
    try {
        const postId = req.params.postId;
        const likes = await Like.find({post: postId}).populate(
            "user",
            "username fullname avatar"
        );

        res.json(likes);
    } catch (error) {
        res.status(500).json({ message: "Server error", error})
    }
};
