"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "@/redux/user/userSlice";

function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    setButtonDisabled(!(formData.email && formData.password));
  }, [formData]);

  const onLogin = async () => {
    try {
      dispatch(loginStart());

      const res = await axios.post("/api/user/login", formData, {
        withCredentials: true, 
      });

      if (res.data.success) {
        dispatch(loginSuccess(res.data.user)); 
        toast.success("Login successful!");
        router.replace("/");
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || "Login failed";
      dispatch(loginFailure(errMsg));
      toast.error(errMsg);
    }
  };


    useEffect(() => {
    if (user) {
 
      router.push("/");
    }
  }, [user, router]);


  return (
    <div className="min-h-screen w-full bg-[linear-gradient(135deg,theme(colors.pink.600),theme(colors.pink.400))] flex flex-col">
      {/* Header */}
      <div className="pt-6 pl-8">
        <h2>
          <span className="md:text-3xl text-2xl text-pink-200 font-medium">
            Quick
          </span>
          <span className="md:text-3xl text-2xl text-pink-900 font-medium">
            Notes
          </span>
        </h2>
      </div>

      {/* Login Card */}
      <div className="flex flex-1 justify-center items-center">
        <div className="flex flex-col items-center shadow-xl border-2 border-white w-110 rounded-xl bg-pink-300 p-10">
          <h1 className="text-5xl mb-8 text-white">
            {loading ? "Processing..." : "Login"}
          </h1>

          {/* Email Input */}
          <div className="flex flex-col items-start">
            <label htmlFor="email" className="ml-[2px] mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter your email"
              className="bg-white p-2 text-black border-3 border-gray-300 rounded-lg mb-6 w-80 focus:outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col items-start relative w-80">
            <label htmlFor="password" className="ml-[2px] mb-1">
              Password
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter your password"
                className="bg-white p-2 text-black border-3 border-gray-300 rounded-lg mb-6 w-full focus:outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <div className="flex justify-start ml-9 mt-5 w-full">
            <button
              onClick={onLogin}
              disabled={buttonDisabled || loading}
              className={`bg-blue-600 text-black w-32 rounded-lg p-2 ${
                buttonDisabled || loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          {/* Links */}
          <div className="flex items-center justify-around text-blue-600 mt-6 w-full">
            <p>New to QuickNotes?</p>
            <Link
              href="/signup"
              className="hover:underline hover:underline-offset-2"
            >
              Create an account
            </Link>
          </div>

          <button
            onClick={() => router.push("/forgotPassword")}
            className="text-blue-600 hover:underline hover:underline-offset-2 mt-2 bg-transparent border-none cursor-pointer"
          >
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
