//likeModel.js
//Модель для лайков (likeModel.js) управляет информацией о том, какие пользователи
//поставили лайки каким постам. Эта модель хранит ссылки на пользователя и пост,
//что позволяет легко отслеживать и управлять лайками в системе.
import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);
const Like = mongoose.model("Like", likeSchema);
export default Like;
