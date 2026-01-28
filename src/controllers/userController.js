import User from "../../models/User";


//Поиск пользователя по ID
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//Обновление информации пользователя
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // ID Берём из токена
    const { fullName, bio, avatar } = req.body;

    const updatedData = {};

    if (fullName) updatedData.fullName = fullName;
    if (bio) updatedData.bio = bio;
    if (avatar) updatedData.avatar = avatar; // Base64 строка

    const updatedUser = await User.findByIdAndUpdate(
    userId, 
    updatedData, 
    {new: true}
      
    ).select("-password");

    res.json({
      message: "Profile updated",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};

//Удаление пользователя
export const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;
    await User.findByIdAndDelete(userId);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Добавление нового полбзователя
export const createUser = async (req, res) => {
  try {
    const { username, fullName, email, password, bio, avatar } = req.body;

    // проверяем уникальность email и пароль
    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingEmail || existingUsername) {
      return res
        .status(400)
        .json({ message: "Email or username already exists" });
    }

    // Создаём пользователя
    const user = await User.create({
      username,
      fullName,
      email,
      password,
      bio: bio || "",
      avatar: avatar || "",
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
