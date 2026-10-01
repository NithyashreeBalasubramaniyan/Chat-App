
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
  const [showRightSidebar, setShowRightSidebar] =
    useState(false);

  // Keep the latest selected user available to socket events
  const selectedUserRef = useRef(null);

  useEffect(() => {
    selectedUserRef.current = selecteduser;
  }, [selecteduser]);

  // ---------- CREATE SOCKET AFTER LOGIN ----------
  useEffect(() => {
    if (!authUser?._id) {
      setSocket(null);
      setOnlineUser([]);
      return;
    }

    const newSocket = io(
      import.meta.env.VITE_BACKEND_URL,
      {
        query: {
          userId: authUser._id,
        },
      }
    );

    setSocket(newSocket);

    // ---------- Online Users ----------
    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUser(
        Array.isArray(users) ? users : []
      );
    });

    // ---------- Incoming Messages ----------
    newSocket.on(
      "newmessage",
      async (newmessage) => {
        if (!newmessage) return;

        const currentSelectedUser =
          selectedUserRef.current;

        if (
          currentSelectedUser?._id ===
          newmessage.senderId
        ) {
          setMessages((prev) => [
            ...prev,
            newmessage,
          ]);

          try {
            await axios.post(
              `/api/messages/mark/${newmessage._id}`
            );
          } catch (error) {
            console.error(
              "Mark message seen error:",
              error
            );
          }
        } else {
          setUnseenmessages((prev) => ({
            ...prev,
            [newmessage.senderId]:
              (prev[newmessage.senderId] || 0) + 1,
          }));
        }
      }
    );

    // ---------- Cleanup ----------
    return () => {
      newSocket.disconnect();
      setSocket((current) =>
        current === newSocket ? null : current
      );
    };
  }, [authUser?._id, axios]);

  // ---------- Get All Users ----------
  const getUser = async () => {
    try {
      const { data } = await axios.get(
        "/api/messages/users"
      );

      if (data.success) {
        setUsers(
          Array.isArray(data.users)
            ? data.users
            : []
        );

        setUnseenmessages(
          data.unseenmsg &&
          typeof data.unseenmsg === "object"
            ? data.unseenmsg
            : {}
        );
      } else {
        setUsers([]);
        setUnseenmessages({});
      }
    } catch (error) {
      console.error("Get users error:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to load users"
      );
    }
  };

  // ---------- Get Messages ----------
  const getMessage = async (userId) => {
    if (!userId) {
      setMessages([]);
      return;
    }

    try {
      const { data } = await axios.get(
        `/api/messages/${userId}`
      );

      if (data.success) {
        setMessages(
          Array.isArray(data.messages)
            ? data.messages
            : []
        );
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Get messages error:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to load messages"
      );
    }
  };

  // ---------- Send Message ----------
  const sendMsg = async (msgData) => {
    if (!selecteduser?._id) {
      toast.error("Please select a user");
      return;
    }

    try {
      const { data } = await axios.post(
        `/api/messages/send/${selecteduser._id}`,
        msgData
      );

      if (data.success && data.newmessage) {
        setMessages((prev) => [
          ...prev,
          data.newmessage,
        ]);
      } else {
        toast.error(
          data.message || "Message could not be sent"
        );
      }
    } catch (error) {
      console.error("Send message error:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to send message"
      );
    }
  };

  // ---------- Context Values ----------
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
