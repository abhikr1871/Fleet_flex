import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatHistory.css";
import { getChatHistory } from "../../services/api";

const ChatHistory = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const currentUser = {
    _id: localStorage.getItem("userId"),
    username: localStorage.getItem("username"),
  };
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!currentUser || !token) return navigate("/login");

    const fetchHistory = async () => {
      try {
        const res = await getChatHistory();
        setUsers(res.data);
      } catch (err) {
        console.error(
          "Failed to fetch chat history:",
          err.response?.data || err.message
        );
      }
    };
    fetchHistory();
  }, [token, navigate]);

  const handleStartChat = (receiverUser) => {
    navigate("/chat", {
      state: {
        currentUser,
        receiverUser,
      },
    });
  };

  return (
    <div className="chat-history-container">
      <h2>Chats</h2>
      {users.length === 0 ? (
        <p>No chats yet.</p>
      ) : (
        <ul className="chat-user-list">
          {users.map((user) => (
            <li key={user._id} onClick={() => handleStartChat(user)}>
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="chat-user-avatar-img"
                />
              ) : (
                <span className="chat-user-avatar">
                  {user.username ? user.username[0].toUpperCase() : "U"}
                </span>
              )}
              <span className="chat-username">{user.username}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatHistory;
