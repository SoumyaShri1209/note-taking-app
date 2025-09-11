import React, { useState } from 'react'
import { MdAdd, MdClose } from 'react-icons/md'

const TagInput = ({tags, setTags}) => {
    const [inputValue , setInputValue ] = useState("")
    const handleRemoveTag=(tagToRemove)=>{
        setTags((tags||[]).filter((tags)=> tags!==tagToRemove))
    }
    const handleInputChange = (e)=>{
        setInputValue(e.target.value)
    }
    const handleKeyDown=(e)=>{
           if(e.key==="Enter"){
            addNewTag()
           }
    }
    const addNewTag=()=>{
        if(inputValue.trim()!==""){
            setTags([...(tags||[]),inputValue.trim()])
            setInputValue("")
        }
    };
  return (
    <div>
        {tags?.length>0 && (
            <div className="flex items-center gap-2 flex-wrap mt-2">
                {
                    tags.map((tags,index)=>(
                        <span key={index} className="flex items-center gap-2 text-sm text-blue-600 bg-pink-300 px-3 py-1 rounded">
                            #{tags}
                            <button onClick={()=>{handleRemoveTag(tags)}}>
                                <MdClose className='text-red-600'/>
                            </button>

                        </span>
                    ))
                }
            </div>
        )}
        <div className='flex items-center gap-4 mt-3 '>
            <input
             type="text"
              value={inputValue} 
              className='text-sm bg-transparent border px-3 py-2 rounded outline-none placeholder-slate-200 text-pink-950 border-white'
             placeholder='Add Tags'
             onChange={handleInputChange}
             onKeyDown={handleKeyDown}
             />
             <button 
             className=' w-8 h-8 flex items-center justify-center rounded  hover:bg-pink-950  cursor-pointer border-2 border-pink-950 '
             onClick={()=>{addNewTag()}}
            
             >
                 <MdAdd className='text-2xl text-pink-950 hover:text-white'/>
             </button>
        </div>
    </div>
  )
}

export default TagInput