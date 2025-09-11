"use client"

import axios from "axios"
import Link from "next/link"
import React, { useEffect, useState } from "react"


export default function ResetForgotPassword() {

    const [password, setPassword] = useState("")
    const [token, setToken] = useState("")
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false) // new state

    

    const resetForgotPassword = async () => {
        try {
            await axios.post("/api/user/resetPassword", { token, newPassword:password })
            setError(false)
            setSuccess(true)
            
        } catch (error) {
            setError(true)
            setSuccess(false)
        }
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const urlToken = params.get("token")
        setToken(urlToken || "")
    }, [])

    return (
        <div className='flex flex-col items-center justify-center min-h-screen py-2 bg-[linear-gradient(135deg,theme(colors.pink.600),theme(colors.pink.400))] '>
            <label htmlFor="password">Enter new password :</label>
            <input
                className='bg-white p-2 text-black border-3 border-gray-300 w-80 rounded-lg mb-6 focus:outline-none focus:border-gray-600'
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='password'
            />

            <button
                onClick={resetForgotPassword}
                className="cursor-pointer mt-4 hover:bg-green-800 hover:border-green-800  border-2 border-white rounded-lg mb-4 focus:outline-none focus:border-gray-600 p-2">
                Change password
            </button>

            {error && (
                <h2 className="text-2xl text-red-800">Password not updated</h2>
            )}

            {success && (
                <h2 className="text-2xl text-green-800">Password updated successfully</h2>
            )}

            <Link className="text-blue-700 text-xl hover:underline" href="/login">Go to login Page</Link>
        </div>
    )
}







