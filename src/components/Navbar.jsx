"use client"
import React, { useState } from 'react'
import SearchBar from './SearchBar/SearchBar'
import ProfileInfo from './Cards/ProfileInfo'
import { useRouter } from 'next/navigation'

const Navbar = ({ userInfo, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery)   
    } else {
      onSearch("")            
    }
  }

  const onClearSearch = () => {
    setSearchQuery("")
    onSearch("")              // reset to show all notes
  }

  const onLogout = () => {
    router.push("/login")
  }

  return (
    <div>
      <div className='flex p-4 items-center justify-between px-8 py-4'>
        <h2>
          <span className='md:text-3xl text-2xl text-pink-200 font-medium'>Quick</span>
          <span className='md:text-3xl text-2xl text-pink-900 font-medium'>Notes</span>
        </h2>
        <SearchBar
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />
        <ProfileInfo userInfo={userInfo} onLogout={onLogout}/>
      </div>
      <hr className="border-t border-pink-300" />
    </div>
  )
}

export default Navbar
