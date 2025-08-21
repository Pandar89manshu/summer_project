import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import axios from "axios";
import { Heart, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import API_BASE from '@/confige';

const Profile = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  useGetUserProfile(userId);

  const { userProfile: globalUserProfile, user } = useSelector(
    (store) => store.auth
  );
  const [userProfile, setUserProfile] = useState(globalUserProfile);
  const [isFollowing, setIsFollowing] = useState(
    globalUserProfile?.followers.includes(user?._id)
  );
  const [activeTab, setActiveTab] = useState("posts");
  const [modalData, setModalData] = useState([]);
  const [modalType, setModalType] = useState("");
  const [showModal, setShowModal] = useState(false);

  const isLoggedInUserProfile = user?._id === globalUserProfile?._id;

  useEffect(() => {
    setUserProfile(globalUserProfile);
    setIsFollowing(globalUserProfile?.followers.includes(user?._id));
  }, [globalUserProfile, user]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleFollowToggle = async () => {
    try {
      const response = await axios.post(
        `${API_BASE}/api/v1/user/followorunfollow/${userId}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        setIsFollowing(!isFollowing);
        setUserProfile((prevProfile) => ({
          ...prevProfile,
          followers: isFollowing
            ? prevProfile.followers.filter(
                (followerId) => followerId !== user?._id
              )
            : [...prevProfile.followers, user?._id],
        }));
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  const fetchModalData = async (type) => {
    try {
      const endpoint = `${API_BASE}/api/v1/user/${userId}/${type}`;
      const response = await axios.get(endpoint, { withCredentials: true });
      if (response.data.success) {
        setModalData(response.data[type]);
        setModalType(type);
        setShowModal(true);
      }
    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
    }
  };

  const handleProfileNavigation = (profileId) => {
    setShowModal(false);
    navigate(`/profile/${profileId}`);
  };

  const displayedPosts =
    activeTab === "posts" && (isFollowing || isLoggedInUserProfile)
      ? userProfile?.posts
      : activeTab === "saved" && isLoggedInUserProfile
      ? globalUserProfile?.bookmarks
      : [];

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-20 p-8 w-full max-w-5xl pl-50">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-40 w-40 ring-7 ring-[#6c96b6]">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profilephoto"
              />
              <AvatarFallback className="bg-white">
                <img alt="CN" className="h-20 w-20 object-cover" />
              </AvatarFallback>
            </Avatar>
          </section>

          <section className="flex justify-center items-center">
            <div className="bg-[#6c96b6] p-6 rounded-lg shadow-md w-full flex flex-col items-center gap-4">
              <span className="text-black font-bold text-2xl">
                {userProfile?.username}
              </span>

              <div className="flex gap-6 text-black text-sm">
                <Dialog open={showModal} onOpenChange={setShowModal}>
                  <p
                    className="cursor-pointer px-3 py-1 hover:bg-[#033f63] hover:text-gray-200 border-2 border-black rounded-md"
                    onClick={() => fetchModalData("followers")}
                  >
                    <span className="font-semibold mr-1">
                      {userProfile?.followers.length}
                    </span>{" "}
                    followers
                  </p>
                  <p
                    className="cursor-pointer px-3 py-1 hover:bg-[#033f63] hover:text-gray-200 border-2 border-black rounded-md"
                    onClick={() => fetchModalData("following")}
                  >
                    <span className="font-semibold mr-1">
                      {userProfile?.following.length}
                    </span>{" "}
                    following
                  </p>

                  {showModal && (
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle className="text-black font-bold mb-4">
                          {modalType === "followers"
                            ? "Followers"
                            : "Following"}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto">
                        {modalData.length === 0 ? (
                          <p className="text-gray-600">No users found</p>
                        ) : (
                          modalData.map((user) => (
                            <div
                              key={user._id}
                              className="flex items-center gap-4 cursor-pointer"
                              onClick={() => handleProfileNavigation(user._id)}
                            >
                              <Avatar className="h-8 w-8 ring-1 ring-[#6c96b6]">
                                <AvatarImage
                                  src={user.profilePicture}
                                  alt={user.username}
                                />
                                <AvatarFallback>
                                  {user.username[0]}
                                </AvatarFallback>
                              </Avatar>

                              <span className="font-semibold text-black">
                                {user.username}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
              </div>

              <div className="text-center">
                <span className="font-semibold text-black">
                  {userProfile?.bio || "bio here..."}
                </span>
              </div>

              <div className="w-full flex justify-center">
                {isLoggedInUserProfile ? (
                  <Link to="/account/edit">
                    <Button className="  bg-[#033f63] text-gray-200 h-8 border-2 border-black">
                      Edit profile
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={handleFollowToggle}
                    className=" bg-[#033f63] text-gray-200 h-8 border-2 border-black"
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="border-t border-black">
          <div className="flex items-center justify-center gap-6 text-sm">
            <span
              className={`py-3 cursor-pointer transition-colors ${
                activeTab === "posts"
                  ? "text-black font-bold underline"
                  : "text-black"
              }`}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
            </span>

            {isLoggedInUserProfile && (
              <span
                className={`py-3 cursor-pointer transition-colors ${
                  activeTab === "saved"
                    ? "text-black font-bold underline"
                    : "text-black"
                }`}
                onClick={() => handleTabChange("saved")}
              >
                SAVED
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-1">
            {displayedPosts?.map((post) => (
              <div
                key={post?._id}
                className="relative group cursor-pointer p-2"
              >
                <img
                  src={post.image}
                  alt="postimage"
                  className="rounded-xl w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-opacity-20 opacity-20 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
                  <div className="flex items-center text-white space-x-4">
                    <button className="flex items-center gap-2 hover:underline">
                      <Heart className="text-white" />
                      <span>{post?.likes.length}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:underline">
                      <MessageCircle className="text-white" />
                      <span>{post?.comments.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
