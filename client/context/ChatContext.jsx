import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { Authcontext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { authUser, axios } = useContext(Authcontext);

  const [socket, setSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);

  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selecteduser, setSelecteduser] = useState(null);
  const [unseenmessages, setUnseenmessages] = useState({});
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  // 🔹 CREATE SOCKET AFTER LOGIN
  useEffect(() => {
    if (!authUser?._id) return;

    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
      query: { userId: authUser._id },
    });

    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUser(users);
    });

    newSocket.on("newmessage", async (newmessage) => {
      if (selecteduser?._id === newmessage.senderId) {
        setMessages((prev) => [...prev, newmessage]);
        await axios.post(`/api/messages/mark/${newmessage._id}`);
      } else {
        setUnseenmessages((prev) => ({
          ...prev,
          [newmessage.senderId]: (prev[newmessage.senderId] || 0) + 1,
        }));
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [authUser]);

  // 🔹 Get all users
  const getUser = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenmessages(data.unseenmsg || {});
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 🔹 Get messages
  const getMessage = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 🔹 Send message
  const sendMsg = async (msgData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selecteduser._id}`,
        msgData
      );
      if (data.success) {
        setMessages((prev) => [...prev, data.newmessage]);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    socket,
    onlineUser,
    users,
    messages,
    selecteduser,
    unseenmessages,
    showRightSidebar,
    setSelecteduser,
    setMessages,
    setUsers,
    setUnseenmessages,
    setShowRightSidebar,
    getUser,
    getMessage,
    sendMsg,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
