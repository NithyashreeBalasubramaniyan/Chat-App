
import React, {
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import "./Sidebar.css";

import { Authcontext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

export const Sidebar = () => {
  const {
    selecteduser,
    setSelecteduser,
    getUser,
    users,
    onlineUser,
    unseenmessages,
    setUnseenmessages,
  } = useContext(ChatContext);

  const { logout } = useContext(Authcontext);

  const [input, setInput] = useState("");
  const navigate = useNavigate();

  // ---------- Safe Data ----------
  const safeUsers = Array.isArray(users) ? users : [];
  const safeOnlineUsers = Array.isArray(onlineUser)
    ? onlineUser
    : [];
  const safeUnseenMessages = unseenmessages || {};

  // ---------- Search Users ----------
  const filteredUser = safeUsers.filter((user) => {
    const name = user?.name || "";

    return name
      .toLowerCase()
      .includes(input.trim().toLowerCase());
  });

  // ---------- Fetch Users ----------
  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="side-bar">
      {/* ---------- Logo and Menu ---------- */}
      <div className="logo-bar">
        <img
          className="logo-img"
          src={assets.logo}
          alt="Logo"
        />

        <div className="menu-section">
          <img
            className="menu-icon"
            src={assets.menu_icon}
            alt="Menu"
          />

          <div className="user-profile">
            <p onClick={() => navigate("/profile")}>
              Profile
            </p>

            <hr />

            <p onClick={logout}>
              Log out
            </p>
          </div>
        </div>
      </div>

      {/* ---------- Search ---------- */}
      <div className="search-bar">
        <img
          src={assets.search_icon}
          alt="Search"
        />

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          id="search"
          className="search"
          type="text"
          placeholder="Search user..."
        />
      </div>

      {/* ---------- User Contacts ---------- */}
      <div className="user-contacts">
        {filteredUser.length > 0 ? (
          filteredUser.map((user) => {
            if (!user?._id) return null;

            const unseenCount =
              safeUnseenMessages[user._id] || 0;

            const isOnline =
              safeOnlineUsers.includes(user._id);

            return (
              <div
                key={user._id}
                className={`user-contact ${
                  selecteduser?._id === user._id
                    ? "selecteduser"
                    : ""
                }`}
                onClick={() => {
                  setSelecteduser(user);

                  setUnseenmessages((prev) => ({
                    ...(prev || {}),
                    [user._id]: 0,
                  }));
                }}
              >
                <img
                  className="user-contact-img"
                  src={
                    user.profilePic ||
                    assets.avatar_icon
                  }
                  alt={user.name || "User"}
                />

                <div className="user-info">
                  <p>{user.name || "Unknown user"}</p>

                  {isOnline ? (
                    <span className="online">
                      online
                    </span>
                  ) : (
                    <span className="offline">
                      offline
                    </span>
                  )}
                </div>

                {/* ---------- Unseen Badge ---------- */}
                {unseenCount > 0 && (
                  <div className="unseen-badge">
                    {unseenCount}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="no-users">
            {input
              ? "No users found"
              : "No contacts available"}
          </p>
        )}
      </div>
    </div>
  );
};
