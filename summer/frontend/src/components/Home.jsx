import React from 'react';
import Feed from './Feed';
import RightSidebar from './RightSidebar';

import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers';
import useGetAllPost from '@/hooks/useGetAllpost';


const Home = () => {

  useGetAllPost();
  useGetSuggestedUsers();
  return (
    <div className="flex sticky top-0 justify-center min-h-screen pt-8 px-4 h-full  bg-[#a6c3dd]">
      {/* Feed */}
      <div className= "w-full max-w-2xl">
        <Feed />
      </div>

      {/* Right Sidebar
      <div className="hidden lg:block w-[20%]">
        <RightSidebar />
      </div> */}
    </div>
  );
};

export default Home;
