



"use client"
import React from 'react'
import { MdOutlinePushPin, MdCreate, MdDelete } from 'react-icons/md'
import moment from 'moment'

const NoteCard = ({ title, date, isPinned, onPinNote, onEdit, onDelete , content, tags }) => {
  return (
    <div className="
      bg-pink-300 
      p-4 
      rounded-lg 
      border-2 border-white 
      shadow-md 
      transition-transform duration-300 ease-in-out 
      hover:scale-105 hover:shadow-2xl 
    ">
      <div className='flex items-center justify-between'>
        <div>
          <h6 className='text-sm text-pink-950 font-semibold'>{title}</h6>
          <span className='text-xs font-medium text-green-700'>{moment(date).format("Do MMM YYYY")}</span>
        </div>

        <MdOutlinePushPin
          className={`${isPinned ? "text-blue-500" : "text-slate-700"} hover:text-blue-500 cursor-pointer`}
          onClick={onPinNote}
        />
      </div>

      <p className='text-sm text-pink-900 mt-2'>
            {content}
      </p>

      <div className='flex items-center justify-between mt-2'>
        <div className='font-medium text-sm text-blue-600'>{tags.map((item)=>`#${item} `)}</div>
        <div className='flex items-center gap-2'>
          <MdCreate
            className='text-slate-700 hover:text-green-600 cursor-pointer'
            
            onClick={onEdit}
          />
          <MdDelete
            className='hover:text-red-500 text-red-600 cursor-pointer'
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  )
}

export default NoteCard
