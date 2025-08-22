import {createSlice} from "@reduxjs/toolkit"

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        suggestedUsers:[],
        userProfile:null,
        selectedUser:null,
    },
  reducers:{
     setAuthUser:(state,action)=>{
        state.user=action.payload;
     },
    setSuggestedUsers:(state,action) => {
            state.suggestedUsers = action.payload;
        },
    setUserProfile:(state,action) => {
            state.userProfile = action.payload;
        },
    setSelectedUser:(state,action) => {
            state.selectedUser = action.payload;
        }
,

     // 🔥 NEW: update follow/unfollow in Redux
    toggleFollow: (state, action) => {
      const { targetUserId, currentUserId } = action.payload;

      // Update selectedUser (profile page you're visiting)
      if (state.selectedUser && state.selectedUser._id === targetUserId) {
        const isFollowing = state.selectedUser.followers.includes(currentUserId);
        if (isFollowing) {
          state.selectedUser.followers = state.selectedUser.followers.filter(
            (id) => id !== currentUserId
          );
        } else {
          state.selectedUser.followers.push(currentUserId);
        }
      }
    
    
    }
});


export const {setAuthUser,setSuggestedUsers,setUserProfile,setSelectedUser, toggleFollow,} = authSlice.actions;
export default authSlice.reducer;