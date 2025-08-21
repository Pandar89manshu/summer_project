import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import API_BASE from '@/confige';

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/user/register`, input, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      if (res.data.success) {
        navigate("/login")
        toast.success(res.data.message);
        setInput({ username: "", email: "", password: "" });
      }
    } catch (error) {
  console.error("Signup Error:", error);
  const message = error.response?.data?.message || "Something went wrong.";
  toast.error(message);
}
 finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center w-screen h-screen justify-center bg-[#033f63]'>
      <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8 bg-[#6c96b6]'>
        <div className='my-4'>
          <h1 className='text-center font-bold text-xl'>LOGO</h1>
          <p className='text-sm text-center'>Signup to see photos & videos from your friends</p>
        </div>
        <div>
          <span className='font-medium'>Username</span>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
            className="bg-gray-200 my-2"
          />
        </div>
        <div>
          <span className='font-medium'>Email</span>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="bg-gray-200 my-2"
          />
        </div>
        <div>
          <span className='font-medium'>Password</span>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="bg-gray-200 my-2"
          />
        </div>
        {
          loading ? (
            <Button>
              ⏳ Please wait
            </Button>
          ) : (
            <Button type='submit'>Signup</Button>
          )
        }
        <span className='text-center'>
          Already have an account? <a href="/login" className='text-[#033f63]'>Login</a>
        </span>
      </form>
    </div>
  );
};

export default Signup;
