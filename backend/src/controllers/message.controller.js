import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async () => {
  try {
    const loggedInUser = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("error in getuserforsidebadr", error.message);
    res.status(500).json({ error: "internal server error" });
  }
};

export const getMessages = async () => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("error in getMessages", error.message);
    res.status(500).json({ error: "internal server error" });
  }
};

export const sendMessage = async () => {
  try {
    const { text, image } = req.body;

    const { id: receiverId } = req.params;

    const senderId = req.user._id;

    let imageUrl;

    if (imageUrl) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // implement Socket io

    res.status(200).json(newMessage);
  } catch (error) {
    console.log("error in send message", error.message);
    res.status(500).json({ error: "internal server error" });
  }
};
