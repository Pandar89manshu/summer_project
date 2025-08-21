import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Posts from "./Posts";
import RightSidebar from "./RightSidebar";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import API_BASE from '@/confige';

const Feed = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim() === "") {
        setSearchResults([]);
        return;
      }
      try {
        const response = await axios.get(
          `${API_BASE}/user/search`,
          {
            params: { query: searchQuery },
            withCredentials: true,
          }
        );
        if (response.data.success) {
          setSearchResults(response.data.users);
        }
      } catch (error) {
        toast.error("Search failed. Please try again.");
      }
    };

    const debounceSearch = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(debounceSearch);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative-15 flex justify-center w-full bg-gray-300 min-h-screen">
      {/* 📰 Main Feed */}
      <div className="flex-1 flex flex-col items-center max-w-2xl px-2 mt-32">
        {/* 🔍 Fixed Search Bar */}
        <div className="fixed top-0 z-10 bg-gray-300 w-full max-w-2xl px-4 py-4 pb-6 border-b border-black left-0 right-0 mx-auto">
          <div className="relative" ref={searchRef}>
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-white" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border bg-[#033f63] text-white border-black rounded-md focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchResults.length > 0 && (
              <ul className="absolute left-0 right-0 mt-2 bg-[#033f63] shadow-lg max-h-60 overflow-y-auto rounded-lg z-10">
                {searchResults.map((user) => (
                  <li
                    key={user._id}
                    onClick={() => navigate(`/profile/${user._id}`)}
                    className="flex items-center gap-2 p-2 hover:bg-[#022b46] cursor-pointer text-white"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.profilePicture} alt={user.username} />
                      <AvatarFallback>
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user.username}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 📝 Posts */}
        <div className="pt-4 w-full">
          <Posts />
        </div>
      </div>

      {/* 📏 Vertical Line between feed and sidebar */}
      <div className="fixed top-0 right-[300px] h-full w-px bg-black z-10" />

      {/* 👤 Right Sidebar */}
      <div className="hidden lg:block fixed top-0 right-0 w-[300px] h-full px-4 pt-7 overflow-y-auto z-20 bg-[#6c96b6]">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Feed;
