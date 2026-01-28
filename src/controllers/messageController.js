import Messsge from "../models/messageModel.js";

//Отправка сообщения
export const sendMessage = async (req, res) => {};
try{
    const {receiver, text} = req.body;

    const message = await Messsge.create({
        sender: req.user._id,
        receiver,
        text,
    });

    res.status(201).json(message);
} catch (error) {
    res.status(500).json({message: "Server error", error})
}

// Получение истории сообщений между двумя пользователями
export const getMessage = async (req, res) => {
    try {
    const {userId} = req.params;
    const messages = await Messsge.find({
        $or: [
        {sender: req.user._id, receiver: userId},
        {sender: userId, receiver: req.user._id}
    ]
    }).sort({createdAt: 1});

    res.json(messages);
} catch (error) {
    res.status(500).json({message: "Server error", error});
}
};