import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Comment = ({ comment }) => {
  return (
    <div className="flex items-start gap-3 mb-3">
      <Link to={`/profile/${comment?.author?._id}`}>
        <Avatar>
          <AvatarImage src={comment?.author?.profilePicture} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex flex-col">
        <Link
          to={`/profile/${comment?.author?._id}`}
          className="text-sm font-semibold hover:underline"
        >
          {comment?.author?.username}
        </Link>
        <p className="text-sm">{comment?.text}</p>
      </div>
    </div>
  );
};

export default Comment;
