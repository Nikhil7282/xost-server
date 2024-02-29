import Message from "../models/messageSchema.js";

const addMessage = async (req, res) => {
  let message = await Message.create({
    sender: "65d4aefa673f13bf2d65d366",
    content: "Hi",
    chatId: "65d4bc7c4e1d0eae49aa5e79",
  });
  console.log(message);
  res.send(message);
};

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid");
    return res.status(400).json({ message: "Invalid Data" });
  }
  let newMessage = {
    sender: req.user._id,
    content: content,
    chatId: chatId,
  };
  try {
    let message = await Message.create(newMessage);
    console.log(message);
    res.status(200).json({ message: "Message Sent", data: message });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", error });
  }
};

const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId });
    return res.status(200).json({ message: "All Messages", data: messages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", error });
  }
};
export { addMessage, sendMessage, allMessages };
