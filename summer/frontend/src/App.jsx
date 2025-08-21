import { useEffect } from 'react'
import ChatPage from './components/ChatPage'
import EditProfile from './components/EditProfile'
import Home from './components/Home'
import Login from './components/Login'
import MainLayout from './components/MainLayout'
import Profile from './components/Profile'
import Signup from './components/Signup'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { io } from "socket.io-client";
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { setLikeNotification } from './redux/rtnSlice'
import ProtectedRoutes from './components/ProtectedRoutes'
import API_BASE from './confige'; // ✅ centralized API base

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      { path: '/', element: <ProtectedRoutes><Home /></ProtectedRoutes> },
      { path: '/profile/:id', element: <ProtectedRoutes><Profile /></ProtectedRoutes> },
      { path: '/account/edit', element: <ProtectedRoutes><EditProfile /></ProtectedRoutes> },
      { path: '/chat', element: <ProtectedRoutes><ChatPage /></ProtectedRoutes> },
    ]
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
])

function App() {
  const { user } = useSelector(store => store.auth);
  const { socket } = useSelector(store => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) return;

    // ✅ Connect to deployed backend
    const socketio = io(API_BASE.replace("/api/v1",""), {
      query: { userId: user._id },
      transports: ['websocket'],
      withCredentials: true
    });
    dispatch(setSocket(socketio));

    // Listen for online users
    socketio.on('getOnlineUsers', (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers));
    });

    // Listen for notifications
    socketio.on('notification', (notification) => {
      dispatch(setLikeNotification(notification));
    });

    // Cleanup on unmount
    return () => {
      socketio.disconnect();
      dispatch(setSocket(null));
    };
  }, [user, dispatch]);

  return (
    <RouterProvider router={browserRouter} />
  )
}

export default App;
