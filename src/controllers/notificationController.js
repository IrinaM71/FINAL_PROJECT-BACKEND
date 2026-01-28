import Notification from "../models/notificationModel";

//Получение всех уведомлений
export const getNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ recipient: userId })
      .populate("sender", "username fullName avatar")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Пометить уведомления как прочитанные
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true },
    );

    res.json({ messag: "Notifications are marked as read" });
  } catch (error) {
    res.status(500).json({ messag: "Server error", error });
  }
};
