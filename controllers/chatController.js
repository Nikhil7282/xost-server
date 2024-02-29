import Chats from "../models/chatSchema.js";
import User from "../models/userSchema.js";

const accessChat = async (req, res) => {
  const { userId } = req.body;
  // console.log(userId);
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
    $or: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { groupAdmin: { $eq: req.user._id } },
    ],
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

const createGroupChat = async (req, res, next) => {
  // console.log(req.body);
  if (!req.body.users || !req.body.groupName) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  const users = JSON.parse(req.body.users);
  // console.log(users);
  if (users.length < 2) {
    return res
      .status(400)
      .json({ message: "atleast two users or more users is Required" });
  }
  try {
    const newGroup = await Chats.create({
      chatName: req.body.groupName,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const group = await Chats.findOne({ _id: newGroup._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    console.log("created");
    return res.status(200).json({ message: "Group Created", data: group });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", error });
  }
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  if (!chatId || !chatName) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  try {
    const group = await Chats.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!group) {
      return res.status(404).json({ message: "Group Not Found" });
    }
    return res.status(200).json({ message: "Group Renamed" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", error });
  }
};

const addToGroup = async (req, res, next) => {
  const { userId, chatId } = req.body;
  if (!userId || !chatId) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  try {
    let chat = await Chats.findOne({ _id: chatId });
    let findUser = chat.users.indexOf(userId);

    if (!chat.isGroupChat) {
      return res
        .status(404)
        .json({ message: "Cannot Add Members to One on One Chat" });
    } else if (findUser != -1) {
      return res.status(400).json({ message: "User Already in Group" });
    } else {
      chat.users.push(userId);
      await chat.save();
      chat = await Chats.populate(chat, {
        path: "users",
        select: "_id name email pic",
      });
      chat = await Chats.populate(chat, {
        path: "groupAdmin",
        select: "_id name email pic",
      });
      res.status(200).json({ message: "Successfully Added", chat });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error", error: error });
  }
};

const removeFromGroup = async (req, res, next) => {
  const { userId, chatId } = req.body;
  if (!userId || !chatId) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  try {
    let chat = await Chats.findOne({ _id: chatId });
    let findUser = chat.users.indexOf(userId);

    if (!chat.isGroupChat) {
      return res
        .status(404)
        .json({ message: "Cannot Remove Member from One on One Chat" });
    } else if (findUser == -1) {
      return res.status(400).json({ message: "User Not Found" });
    } else {
      chat.users.splice(findUser, 1);
      await chat.save();
      chat = await Chats.populate(chat, {
        path: "users",
        select: "_id name email pic",
      });
      chat = await Chats.populate(chat, {
        path: "groupAdmin",
        select: "_id name email pic",
      });
      res.status(200).json({ message: "Successfully Removed", chat });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error", error: error });
  }
};

export {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
