import React from 'react'
import { FaMagnifyingGlass } from "react-icons/fa6"
import { IoMdClose } from "react-icons/io"

const SearchBar = ({ value, onChange, handleSearch ,onClearSearch}) => {
  return (
    <div className="flex items-center min-w-[220px] sm:w-64 md:w-80 lg:w-96 px-2 rounded-xl bg-white">
      <input
        type="text"
        placeholder="Search Notes..."
        className="flex-1 h-8 px-2 text-sm text-black bg-white rounded-l-xl outline-none"
        value={value}
        onChange={onChange}
      />

      {value &&<IoMdClose
       className="text-gray-500 text-lg mr-2 cursor-pointer hover:text-black"
       onClick={onClearSearch}
       />}
      <FaMagnifyingGlass
        className="text-gray-500 text-lg ml-1 cursor-pointer hover:text-black"
        onClick={handleSearch}
      />
    </div>
  )
}

export default SearchBar;

