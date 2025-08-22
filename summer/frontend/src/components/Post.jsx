import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { MoreHorizontal, MessageCircle } from "lucide-react";
import { FaHeart, FaRegHeart, FaRegBookmark, FaBookmark } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import API_BASE from "@/confige";

const Post = ({ post }) => {
  const { posts } = useSelector((store) => store.post);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const [bookmarked, setBookmarked] = useState(
    post.bookmarks?.includes(user?._id) || false
  );
  const [isFollowing, setIsFollowing] = useState(
    (post.author.followers || []).includes(user?._id)
  );

  const currentPost = posts.find((p) => p._id === post._id) || post;

  useEffect(() => {
    setIsFollowing((currentPost.author.followers || []).includes(user?._id));
  }, [currentPost.author.followers, user?._id]);

  useEffect(() => {
    setBookmarked(currentPost.bookmarks?.includes(user?._id));
  }, [currentPost.bookmarks, user?._id]);

  const changeEventHandler = (e) => {
    setText(e.target.value.trim() ? e.target.value : "");
  };

  const handleFollowToggle = async () => {
    try {
      const res = await axios.post(
        `${API_BASE}/user/followorunfollow/${post.author._id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPosts = posts.map((p) =>
          p.author._id === post.author._id
            ? {
                ...p,
                author: {
                  ...p.author,
                  followers: isFollowing
                    ? (p.author.followers || []).filter((id) => id !== user._id)
                    : [...(p.author.followers || []), user._id],
                },
              }
            : p
        );
        dispatch(setPosts(updatedPosts));
        setIsFollowing(!isFollowing);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(`${API_BASE}/post/${post._id}/${action}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setPostLike(liked ? postLike - 1 : postLike + 1);
        setLiked(!liked);

        const updatedPosts = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPosts));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `${API_BASE}/post/${post._id}/comment`,
        { text },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPosts = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPosts));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`${API_BASE}/post/delete/${post._id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        const updatedPosts = posts.filter((p) => p._id !== post._id);
        dispatch(setPosts(updatedPosts));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(`${API_BASE}/post/${post._id}/bookmark`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setBookmarked(!bookmarked);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
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
            <Link to={`/profile/${post.author._id}`} className="font-semibold hover:underline">
              {post.author?.username}
            </Link>

            {user?._id === post.author._id ? (
              <Badge className="bg-[#033f63] border-black text-gray-200" variant="secondary">
                Author
              </Badge>
            ) : (
              <Button
                className="h-6 px-4 py-4 text-l bg-[#033f63] hover:bg-[#033f63] text-gray-200 border-black"
                onClick={handleFollowToggle}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div>
        </div>

        {user && user?._id === post?.author._id && (
          <Dialog>
            <DialogTrigger asChild>
              <MoreHorizontal className="cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center text-sm text-center">
              <Button onClick={deletePostHandler} variant="ghost" className="cursor-pointer w-fit">
                Delete
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <img className="rounded-sm my-2 w-full aspect-square object-cover" src={post.image} alt="post_img" />

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart onClick={likeOrDislikeHandler} size={"24"} className="cursor-pointer text-red-600" />
          ) : (
            <FaRegHeart onClick={likeOrDislikeHandler} size={"22px"} className="cursor-pointer hover:text-gray-600" />
          )}

          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
        </div>

        {bookmarked ? (
          <FaBookmark onClick={bookmarkHandler} className="cursor-pointer text-[22px] text-[#033f63]" />
        ) : (
          <FaRegBookmark onClick={bookmarkHandler} className="hover:text-[#033f63] cursor-pointer text-[22px]" />
        )}
      </div>

      <span className="font-medium block mb-2">{postLike} likes</span>
      <p>
        <span className="font-medium mr-2">{post.author?.username}</span>
        {post.caption}
      </p>

      {comment.length > 0 && (
        <span
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
          className="cursor-pointer text-sm text-gray-400"
        >
          View all {comment.length} comments
        </span>
      )}

      <CommentDialog open={open} setOpen={setOpen} />

      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          className="outline-none text-sm w-full"
        />
        {text && (
          <span onClick={commentHandler} className="text-[#3BADF8] cursor-pointer">
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
