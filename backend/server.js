const app = require("./app");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/Message");
const User = require("./api/users/model");
const Captain = require("./api/captian/captain_model");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
}); 

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join", ({ userId }) => {
    socket.join(userId); // Each user joins their personal room
  });

  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId); // Join the private chat room
  });

  socket.on("send_message", async ({ sender, receiver, content, roomId }) => {
    if (!sender || !receiver || !content || !roomId) {
      console.warn("Missing required fields in message");
      return;
    }

    console.log("Message received:", { sender, receiver, content, roomId });

    try {
      // Auto-detect sender and receiver model
      let senderModel, receiverModel;

      const senderIsUser = await User.findById(sender);

      if (senderIsUser) {
        senderModel = "User";
        receiverModel = "Captain";
      } else {
        senderModel = "Captain";
        receiverModel = "User";
      }

      const newMessage = new Message({
        sender,
        senderModel,
        receiver,
        receiverModel,
        content,
      });

      await newMessage.save();
      console.log("Message saved to database:", newMessage);

      const msgData = {
        sender,
        senderModel,
        receiver,
        receiverModel,
        content,
        timestamp: newMessage.createdAt,
      };

      io.to(roomId).emit("receive_message", msgData);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
