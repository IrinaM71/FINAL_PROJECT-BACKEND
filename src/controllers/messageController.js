import Message from "../models/messageModel.js";

//Отправка сообщения
export const sendMessage = async (req, res) => {
  try {
    const { receiver, text } = req.body;

    const message = await Message.create({
      sender: req.user._id,
      receiver,
      text,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Получение истории сообщений между двумя пользователями
export const getMessage = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
