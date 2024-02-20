import Chats from "../models/chatSchema.js";
import User from "../models/userSchema.js";

const accessChat = async (req, res) => {
  const { userId } = req.body;
  let chat;
  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }
  try {
    chat = await Chats.find({
      isGroupChat: false,
      $and: [
        {
          users: { $elemMatch: { $eq: req.user._id } },
        },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    // chat = await User.populate(chat, {
    //   path: "latestMessage.sender",
    //   select: "name pic email",
    // });

    if (chat.length > 0) {
      return res.status(200).json({ message: "Chat Fetched", chat });
    } else {
      let newChat = await Chats.create({
        isGroupChat: false,
        users: [req.user._id, userId],
        latestMessage: null,
        groupAdmin: null,
      });
      let LatestChat = Chats.findOne({ _id: newChat._id }).populate(
        "users",
        "-password"
      );
      return res
        .status(200)
        .json({ message: "Chat Created", chat: LatestChat });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error, message: "Server error" });
  }
};

const fetchChats = async (req, res) => {
  let chats = await Chats.find({
    users: { $elemMatch: { $eq: req.user._id } },
  })
    .populate("users", "-password")
    .populate("latestMessage")
    .populate("groupAdmin")
    .sort({ updatedAt: -1 });

  // chats = await User.populate(chat, {
  //   path: "latestMessage.sender",
  //   select: "name pic email",
  // });
  return res.send(chats);
};

export { accessChat, fetchChats };
