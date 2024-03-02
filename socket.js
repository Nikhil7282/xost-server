import { Server } from "socket.io";

export const socketInstance = (expressServer) => {
  const io = new Server(expressServer, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket Connected`);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`Joined room ${roomId}}`.blue.bold);
    });
    socket.on("send-message", (message) => {
      console.log(message);
      let chatUsers = [...message.chatId.users, message.chatId.groupAdmin];
      chatUsers.forEach((user) => {
        if (user !== message.sender) {
          socket.to(message.chatId._id).emit("receive-message", message);
        }
      });
    });
    socket.on("typing", (user) => {
      socket.to().emit("typingEvent", user);
    });
    socket.on("stopTyping", (user) => {
      socket.to().emit("stopTypingEvent", user);
    });
  });
};
