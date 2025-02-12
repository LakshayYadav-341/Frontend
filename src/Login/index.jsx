import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { URL } from '../utils/constants';
import { toast } from 'react-toastify';
import { loginSuccess } from '../stores/Action/authActions';
import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const notify = () => toast.error("Invalid credentials", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true
  });

  async function loginUser() {
    try {
      const result = await axiosInstance.post(`/api/login`, { email, password });
      if (result?.data?.success === true) {
        const userDetails = result.data.data;
        const userData = {
          token: userDetails.token,
          user: {
            email: userDetails.email_id,
            fullName: userDetails.full_name,
            mobileNumber: userDetails.mobile_number,
            address: userDetails.address,
            profileImage: userDetails.profile_image,
            userType: userDetails.user_type,
            id: userDetails._id,
          },
        };
        sessionStorage.setItem("user-token", result.data.data.token);
        sessionStorage.setItem("userData", JSON.stringify(userData));
        dispatch(loginSuccess(userData));
        navigate("/dashboard");
      }
    } catch (err) {
      console.log("Something went wrong: Login");
      setError(err.response.data.message);
      notify();
      throw new Error(err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    loginUser();
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 bg-image">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white bg-opacity-75 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-white-900 dark:text-white">Your email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
              <small className='text-red-500'>{error ? error : ""}</small>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
