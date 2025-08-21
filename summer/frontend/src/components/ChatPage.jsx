import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MessageCircleCode } from "lucide-react";
import Messages from "./Messages";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const { suggestedUsers, selectedUser } = useSelector((store) => store.auth);
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <div className="flex ml-[20%] h-screen bg-[#033f63] text-white">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 p-4 bg-gray-200 border-r border-black text-black">

      <div className="flex justify-content-cen">

      </div>
       <h2
  className={`text-2xl font-bold text-center mb-4 text-[#033f63] ${
    selectedUser ? 'border-b border-[#1f4f71] pb-6' : ''
  }`}
>
  Chats
</h2>

        <div className="overflow-y-auto h-[82vh] space-y-2">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div
                key={suggestedUser._id}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className="flex items-center gap-4 p-3 rounded-lg transition cursor-pointer hover:bg-[#033f63] hover:text-white"
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={suggestedUser?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 block w-3 h-3 rounded-full bg-green-whir border-2 border-white" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{suggestedUser?.username}</p>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main Chat Area */}
      {selectedUser ? (
        <main className="flex-1 flex flex-col h-full bg-gray-200">
          {/* Header */}
          <header className="flex items-center gap-4 px-5 py-4 border-b border-[black] bg-[#6c96b6]">
            <Avatar className="w-10 h-10">
              <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-lg text-black">
                {selectedUser?.username}
              </span>
            </div>
          </header>

          {/* Messages */}
          <section className="flex-1 overflow-y-auto p-4">
            <Messages selectedUser={selectedUser} />
          </section>

          {/* Message Input */}
          <footer className="flex items-center p-4 border-t border-[black] bg-[#6c96b6]">
            <Input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              className="flex-1 mr-2 bg-white text-black placeholder-gray-500 focus-visible:ring-2 focus-visible:ring-white"
              placeholder="Type your message..."
            />
            <Button
              onClick={() => sendMessageHandler(selectedUser?._id)}
              className="px-6 bg-white text-black hover:bg-[#033f63] font-semibold"
            >
              Send
            </Button>
          </footer>
        </main>
      ) : (
        <main className="flex-1 flex items-center justify-center bg-gray-300 text-white text-center">
  <div>
    <MessageCircleCode className="w-32 h-32 text-white mb-4 mx-auto" />
    <h1 className="text-xl font-semibold">Your messages</h1>
    <p className="text-sm">
      Send a message to start a conversation
    </p>
  </div>
</main>

      )}
    </div>
  );
};

export default ChatPage;




