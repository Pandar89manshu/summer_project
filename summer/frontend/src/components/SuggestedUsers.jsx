import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className='my-10'>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`px-4 py-2 mb-4 rounded-md border border-[black] transition-colors
          ${isVisible
            ? 'bg-[#033f63] text-gray-200'
            : 'bg-gray-200 text-[black] hover:bg-[#033f63] hover:text-gray-200'}
        `}
      >
        Suggested Users
      </button>

      {/* Suggested Users List */}
      {isVisible && (
        <div>
          {suggestedUsers.map((user) => (
            <div key={user._id} className='flex items-center justify-between my-5'>
              <div className='flex items-center gap-2'>
                <Link to={`/profile/${user?._id}`}>
                  <Avatar className="h-10 w-10 ring-1 ring-[#6c96b6]">
                    <AvatarImage src={user?.profilePicture} alt="user" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <h1 className='font-semibold text-sm text-black'>
                    <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                  </h1>
                  <span className='text-gray-300 text-sm'>
                    {user?.bio || 'Bio here...'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuggestedUsers;
