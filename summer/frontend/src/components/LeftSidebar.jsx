import { setAuthUser } from "@/redux/authSlice";
import { clearLikeNotifications } from "@/redux/rtnSlice";
import { setSocket } from "@/redux/socketSlice"; // ✅ NEW: Import setSocket
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CreatePost from "./CreatePost";
import API_BASE from '../confige'; // ✅ centralized API base

const LeftSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.auth);
  const notifications = useSelector(
    (state) => state.realTimeNotification.likeNotification
  );
  const { socket } = useSelector((store) => store.socketio); // ✅ NEW: Get socket from Redux

  const [open, setOpen] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  const logoutHandler = async () => {
    try {
      if (socket) {
        socket.disconnect(); // ✅ disconnect socket
        dispatch(setSocket(null)); // ✅ clear from Redux
      }

      const res = await axios.get(`${API_BASE}/user/logout`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setAuthUser(null));
        navigate("/login");
        toast.success(res.data.message);
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        "Logout failed (network/server error)";
      toast.error(errorMsg);
    }
  };

  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen(true);
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
      navigate(`/`);
    } else if (textType === "Message") {
      navigate("/chat");
    } else if (textType === "Notifications") {
      setShowNotificationPopup(!showNotificationPopup);
      dispatch(clearLikeNotifications());
    }
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Message" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    { icon: <LogOut />, text: "Logout" },
    {
      icon: (
        <Avatar className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#6c96b6]">
          <AvatarImage
            src={user?.profilePicture}
            className="w-full h-full object-cover rounded-full"
          />
          <AvatarFallback className="bg-gray-200 text-black text-sm flex items-center justify-center">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
  ];

  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-black w-[20%] h-screen bg-[#6c96b6]">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-center my-8 text-black border-b border-[#033f63] pb-4">
          LOGO
        </h1>
        <div>
          {sidebarItems.map((item, index) => {
            const isNotification = item.text === "Notifications";
            const showRedDot = isNotification && notifications.length > 0;

            return (
              <div
                onClick={() => sidebarHandler(item.text)}
                key={index}
                className="flex items-center gap-6 relative bg-gray-200 border border-black hover:bg-[#033f63] hover:text-gray-200 cursor-pointer rounded-lg p-3 my-3 transition-colors"
              >
                {item.icon}
                <span>{item.text}</span>

                {showRedDot && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
                )}
              </div>
            );
          })}
        </div>

        {showNotificationPopup && (
          <div className="absolute left-full top-[180px] ml-2 w-64 bg-white text-black rounded shadow-lg p-4 z-50">
            {notifications.length === 0 ? (
              <p>No new notifications</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.userId}
                  className="flex items-center gap-2 my-2"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={notification.userDetails?.profilePicture}
                      alt={notification.userDetails?.username}
                    />
                    <AvatarFallback>
                      {notification.userDetails?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm">
                    <span className="font-bold">
                      {notification.userDetails?.username}
                    </span>{" "}
                    liked your post
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
