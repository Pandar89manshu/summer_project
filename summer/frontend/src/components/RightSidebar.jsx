import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';

const RightSidebar = () => {
  const { user } = useSelector(store => store.auth);

  return (
    <div className='w-full'>
      <div className='sticky top-0'>
        {/* User Info with bottom border */}
        <div className='flex items-center gap-3 pb-4 mb-4 border-b border-black'>
          <Link to={`/profile/${user?._id}`}>
            <Avatar className="h-10 w-10 ring-[#6c96b6]">
              <AvatarImage src={user?.profilePicture} alt="user avatar" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <h1 className='font-semibold text-sm text-black leading-none'>
              <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
            </h1>
            <p className='text-gray-300 text-xs truncate max-w-[180px]'>
              {user?.bio || 'Bio here...'}
            </p>
          </div>
        </div>

        {/* Suggested Users */}
        <SuggestedUsers />
      </div>
    </div>
  );
};

export default RightSidebar;
