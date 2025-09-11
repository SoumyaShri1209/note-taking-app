import React from 'react'

const EmptyCard = ({imgSrc, message}) => {
  return (
    <div className='flex flex-col items-center justify-center mt-20'>
        <img src={imgSrc}  alt="No notes" className='w-60' />
        <p className='w-1/2  font-medium text-slate-200 text-xl text-center leading-7 mt-8'>{message}</p>
    </div>
  )
}

export default EmptyCard