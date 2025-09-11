"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("verifying"); // "verifying", "success", "error"
  const router = useRouter();

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/user/verifyemail", { token });
      setStatus("success");

      // Redirect after 2 seconds
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setStatus("error");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    if (urlToken) setToken(urlToken);
  }, []);

  useEffect(() => {
    if (token) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-r from-pink-600 to-pink-400">
      <h1 className="text-4xl m-10 text-pink-950">Verify Email</h1>

      {status === "verifying" && <h2 className="text-2xl m-10">Verifying...</h2>}
      {status === "success" && (
        <h2 className="text-2xl text-green-900 m-10">
          Email Verified Successfully! Redirecting to login...
        </h2>
      )}
      {status === "error" && (
        <h2 className="text-2xl text-red-500 m-10">
          Verification Failed or Token Expired
        </h2>
      )}
    </div>
  );
}
