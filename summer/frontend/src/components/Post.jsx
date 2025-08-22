import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";
import { setUserProfile } from "@/redux/authSlice";
import { Link } from "react-router-dom";
import API_BASE from "@/confige";

const Post = ({ post }) => {
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);
  const { user, userProfile } = useSelector((store) => store.auth);

  // Always get latest post data from Redux
  const currentPost = posts.find((p) => p._id === post._id) || post;

  const isFollowing = currentPost.author.followers?.includes(user?._id);

  const handleFollowToggle = async () => {
    try {
      const response = await axios.post(
        `${API_BASE}/user/followorunfollow/${post.author._id}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        // 1️⃣ Update posts
        const updatedPosts = posts.map((p) =>
          p.author._id === post.author._id
            ? {
                ...p,
                author: {
                  ...p.author,
                  followers: isFollowing
                    ? p.author.followers.filter((id) => id !== user._id)
                    : [...p.author.followers, user._id],
                },
              }
            : p
        );
        dispatch(setPosts(updatedPosts));

        // 2️⃣ Update profile if needed
        if (post.author._id === userProfile?._id) {
          dispatch(
            setUserProfile({
              ...userProfile,
              followers: isFollowing
                ? userProfile.followers.filter((id) => id !== user._id)
                : [...userProfile.followers, user._id],
            })
          );
        }

        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Follow/unfollow error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto border-b border-black pb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to={`/profile/${post.author?._id}`}>
            <Avatar>
              <AvatarImage src={post.author?.profilePicture} alt="post_image" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to={`/profile/${post.author._id}`}
              className="font-semibold hover:underline"
            >
              {post.author?.username}
            </Link>

            {user?._id !== post.author._id && (
              <Button
                onClick={handleFollowToggle}
                className="h-6 px-4 py-4 text-l bg-[#033f63] hover:bg-[#033f63] text-gray-200 border-black"
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div>
        </div>

        {user?._id === post.author._id && (
          <Dialog>
            <DialogTrigger asChild>
              <MoreHorizontal className="cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center text-sm text-center">
              <Button variant="ghost" className="cursor-pointer w-fit">
                Delete
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={post.image}
        alt="post_img"
      />
      <p className="font-medium mt-2">{post.caption}</p>
    </div>
  );
};

export default Post;
