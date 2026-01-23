//Работа с постами включает в себя создание, отображение, обновление и удаление
//постов пользователя. Для этого мы создаем модель постов (postModel.js), которая
//будет хранить информацию о каждом посте: текстовое описание, изображение
//(сохраняем его в формате Base64, как и для профиля пользователя), а также ссылку
//на автора поста.
//Модель взаимодействует с MongoDB через Mongoose, что позволяет легко
//выполнять CRUD операции (создание, чтение, обновление, удаление) над
//документами в базе данных.

import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
const Post = mongoose.model("Post", postSchema);
export default Post;
