//Для работы с постами создаётся контроллер postController.js, который будет
//включать основные функции для выполнения операций с постами:
//1. Получение всех постов пользователя: Позволяет вывести все посты,
//созданные конкретным пользователем.
//2. Создание поста: Принимает изображение, которое конвертируется в формат
//Base64, и текстовое описание. Пост сохраняется в базе данных вместе с
//ссылкой на автора.
//3. Удаление поста: Удаляет пост по его ID, если пользователь является автором.
//4. Получение конкретного поста по ID Возвращает информацию о посте,
//включая описание и изображение.
//5. Обновление поста: Позволяет изменить описание или изображение поста.
//6. Получение всех постов: Возвращает список всех постов (например, для ленты
//новостей).

import Post from "../models/Post.js";

// Получение всех постов пользователя
export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Создание поста
export const createPost = async (req, res) => {
  const { image, description } = req.body;
  try {
    const post = new Post({ author: req.user.id, image, description });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Удаление поста
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await post.remove();
    res.json({ message: "Post removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Получение конкретного поста по ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Обновление поста
export const updatePost = async (req, res) => {
  const { image, description } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    post.image = image || post.image;
    post.description = description || post.description;
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Получение всех постов
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username fullName");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
