const Message = require("../models/Message");
const User = require("../api/users/model");
const Captain = require("../api/captian/captain_model");

const getChatHistory = async (req, res) => {
  try {
    console.log("req.user:", req.user);
    const currentUserId = req.user.id.toString();

    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    });

    const uniquePartners = {};
    messages.forEach((msg) => {
      if (msg.sender.toString() === currentUserId) {
        uniquePartners[msg.receiver + "_" + msg.receiverModel] = {
          id: msg.receiver,
          model: msg.receiverModel,
        };
      } else {
        uniquePartners[msg.sender + "_" + msg.senderModel] = {
          id: msg.sender,
          model: msg.senderModel,
        };
      }
    });

    const userIds = [];
    const captainIds = [];
    Object.values(uniquePartners).forEach((partner) => {
      if (partner.model === "User") userIds.push(partner.id);
      else if (partner.model === "Captain") captainIds.push(partner.id);
    });

    // ✅ Fetch users with profileImage
    const users = await User.find({ _id: { $in: userIds } }).select(
      "_id username profileImage"
    );

    // ✅ Fetch captains with profileImage
    const captains = await Captain.find({ _id: { $in: captainIds } }).select(
      "_id username profileImage"
    );

    // ✅ Combine both with profileImage
    const chatPartners = [
      ...users.map((u) => ({
        _id: u._id,
        username: u.username,
        profileImage: u.profileImage,
        type: "User",
      })),
      ...captains.map((c) => ({
        _id: c._id,
        username: c.username,
        profileImage: c.profileImage,
        type: "Captain",
      })),
    ];

    res.json(chatPartners);
  } catch (error) {
    console.error("Error fetching chat history:", error.message);
    res.status(500).json({ msg: "Failed to fetch chat history" });
  }
};

module.exports = {
  getChatHistory,
};
