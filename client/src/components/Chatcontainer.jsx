
import React, {
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import toast from "react-hot-toast";
import smoothscroll from "smoothscroll-polyfill";

import "./Chatcontainer.css";
import { formatDate } from "../lib/utils";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { Authcontext } from "../../context/AuthContext";

smoothscroll.polyfill();

export const Chatcontainer = () => {
  const {
    selecteduser,
    setSelecteduser,
    setUnseenmessages,
    messages,
    getMessage,
    showRightSidebar,
    setShowRightSidebar,
    sendMsg,
    onlineUser,
  } = useContext(ChatContext);

  const { authUser } = useContext(Authcontext);

  const [input, setInput] = useState("");
  const scrollEnd = useRef(null);

  // Send text message
  const handletextInput = async (e) => {
    e.preventDefault();

    if (input.trim() === "") return;

    await sendMsg({ text: input.trim() });
    setInput("");
  };

  // Send image message
  const handleimgMsg = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Select an image file please");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        await sendMsg({ image: reader.result });
      } finally {
        e.target.value = "";
      }
    };

    reader.readAsDataURL(file);
  };

  // Load messages when selected user changes
  useEffect(() => {
    if (selecteduser?._id) {
      getMessage(selecteduser._id);

      setUnseenmessages((prev) => {
        const copy = { ...prev };
        delete copy[selecteduser._id];
        return copy;
      });
    }
  }, [selecteduser?._id]);

  // Scroll to latest message
  useEffect(() => {
    scrollEnd.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (!selecteduser) {
    return (
      <div className="chat-initial">
        <img src={assets.logo_icon} alt="Logo" />
        <p>Chat with Anyone, Anytime...</p>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="user-detail">
          <img
            className="chat-user-img"
            src={
              selecteduser?.profilePic ||
              assets.avatar_icon
            }
            alt="User profile"
          />

          <p>{selecteduser.name}</p>

          {Array.isArray(onlineUser) &&
            onlineUser.includes(selecteduser._id) && (
              <span className="green-ball"></span>
            )}
        </div>

        <div className="chat-icon-block">
          <img
            className="arrow-icon"
            onClick={() => setSelecteduser(null)}
            src={assets.arrow_icon}
            alt="Back"
          />

          <img
            className="help-icon"
            src={assets.help_icon}
            alt="Toggle sidebar"
            onClick={() =>
              setShowRightSidebar(!showRightSidebar)
            }
          />
        </div>
      </div>

      <div className="chat-space">
        {Array.isArray(messages) &&
          messages.map((msg, index) => (
            <div
              key={msg._id || index}
              className={`chat-box ${
                msg.senderId !== authUser?._id
                  ? "left-orient"
                  : "right-orient"
              }`}
            >
              {msg.image ? (
                <img
                  className="msg-img"
                  src={msg.image}
                  alt="Shared message"
                />
              ) : (
                <p className="ptag">{msg.text}</p>
              )}

              <div className="img-and-date">
                <img
                  src={
                    msg.senderId === authUser?._id
                      ? authUser?.profilePic ||
                        assets.avatar_icon
                      : selecteduser?.profilePic ||
                        assets.avatar_icon
                  }
                  alt="Sender profile"
                />

                <p>{formatDate(msg.createdAt)}</p>
              </div>
            </div>
          ))}

        <div ref={scrollEnd}></div>
      </div>

      <div className="msg-entry">
        <div className="entry-space">
          <input
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && handletextInput(e)
            }
            value={input}
            className="text-space"
            id="text-space"
            type="text"
            placeholder="Type message here"
          />

          <input
            onChange={handleimgMsg}
            id="image"
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            hidden
          />

          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="Upload image" />
          </label>
        </div>

        <img
          className="send-icon"
          onClick={handletextInput}
          src={assets.send_button}
          alt="Send message"
        />
      </div>
    </div>
  );
};
