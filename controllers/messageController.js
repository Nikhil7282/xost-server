import path from "path";
import Message from "../models/messageSchema.js";

const addMessage = async (req, res) => {
  let message = await Message.create({
    sender: "65d4aefa673f13bf2d65d366",
    content: "Hi",
    chatId: "65d4bc7c4e1d0eae49aa5e79",
  });
  // console.log(message);
  res.send(message);
};

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({ message: "Invalid Data" });
  }
  let newMessage = {
    sender: req.user._id,
    content: content,
    chatId: chatId,
  };
  try {
    let message = await Message.create(newMessage);
    message = await Message.populate(message, {
      path: "chatId",
    });
    message = await Message.populate(message, { path: "sender" });
    res.status(200).json({ message: "Message Sent", data: message });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", error });
  }
};

const allMessages = async (req, res) => {
  try {
    let messages = await Message.find({ chatId: req.params.chatId });
    messages = await Message.populate(messages, {
      path: "chatId",
    });
    messages = await Message.populate(messages, { path: "sender" });
    return res.status(200).json({ message: "All Messages", data: messages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", error });
  }
};
export { addMessage, sendMessage, allMessages };
