import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Authcontext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selecteduser, setSelecteduser] = useState(null);
  const [unseenmessages, setUnseenmessages] = useState({});

  const selectedUserRef = useRef(null); // ✅ NEW
  const { socket, axios } = useContext(Authcontext);

  useEffect(() => {
    selectedUserRef.current = selecteduser; // ✅ always latest
  }, [selecteduser]);

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

 useEffect(() => {
  if (!socket) return;

  const handleNewMessage = async (newmessage) => {
    const currentSelectedUserId = selecteduser?._id;

    if (currentSelectedUserId === newmessage.senderId) {
      // We're chatting with sender now, show live
      setMessages((prev) => [...prev, { ...newmessage, seen: true }]);
      await axios.post(`/api/messages/mark/${newmessage._id}`);
    } else {
      // Not chatting, update unseen counter
      setUnseenmessages((prev) => ({
        ...prev,
        [newmessage.senderId]: (prev[newmessage.senderId] || 0) + 1,
      }));
    }
  };

  socket.on('newmessage', handleNewMessage);

  return () => {
    socket.off('newmessage', handleNewMessage);
  };
}, [socket, selecteduser]);

 


  const value = {
    selecteduser,
    setSelecteduser,
    messages,
    setMessages,
    users,
    setUsers,
    unseenmessages,
    setUnseenmessages,
    getUser,
    getMessage,
    sendMsg,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
