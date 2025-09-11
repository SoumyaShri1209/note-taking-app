"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "", username: "" });
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  const onSignup = async () => {
    setLoading(true);

    if (!isValidEmail(user.email)) {
      toast.error("Invalid email format!");
      setLoading(false);
      return;
    }

    try {
      await axios.post("/api/user/signup", {
        username: user.username.trim(),
        email: user.email.trim(),
        password: user.password.trim(),
      });
      toast.success("Signup successful! Verification email sent.");
      router.push("/login");
    } catch (error) {
      toast.error("User already exists");
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    const formValid =
      user.username.trim().length > 0 &&
      user.password.trim().length > 0 &&
      isValidEmail(user.email);
    setButtonDisabled(!formValid);
  }, [user]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-pink-600 to-pink-400 flex flex-col">
      {/* Header */}
      <div className="pt-6 pl-8">
        <h2>
          <span className="text-2xl md:text-3xl text-pink-200 font-medium">Quick</span>
          <span className="text-2xl md:text-3xl text-pink-900 font-medium">Notes</span>
        </h2>
      </div>

      {/* Signup Card */}
      <div className="flex flex-1 justify-center items-center">
        <div className="flex flex-col items-center shadow-xl border-2 border-white w-110 rounded-xl bg-pink-300 p-10">
          <h1 className="text-5xl mb-8 text-white">{loading ? "Processing..." : "Signup"}</h1>

          {/* Username */}
          <div className="flex flex-col items-start">
            <label htmlFor="username" className="ml-[2px] mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              placeholder="Username"
              className="bg-white p-2 text-black border-2 border-gray-300 rounded-lg mb-6 focus:outline-none w-80"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col items-start">
            <label htmlFor="email" className="ml-[2px] mb-1">
              Email
            </label>
            <input
              type="text"
              id="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Email"
              className={`bg-white p-2 text-black border-2 rounded-lg mb-6 focus:outline-none w-80 ${
                user.email && !isValidEmail(user.email) ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col items-start relative w-80">
            <label htmlFor="password" className="ml-[2px] mb-1">
              Password
            </label>
            <div className="relative w-80">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder="Password"
                className="bg-white p-2 text-black border-2 border-gray-300 rounded-lg mb-6 w-full"
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

          {/* Signup Button */}
          <div className="flex mr-60 mt-5">
            <button
              onClick={onSignup}
              disabled={buttonDisabled}
              className={`bg-green-500 text-black rounded-lg mb-4 p-2 ${
                buttonDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Redirect to login */}
          <div className="flex items-center justify-center">
            <p className="text-blue-600 mr-4">Already have an account?</p>
            <Link href="/login" className="hover:underline text-blue-600">
              Visit login page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;


