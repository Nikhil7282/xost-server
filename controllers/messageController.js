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

export { addMessage };
