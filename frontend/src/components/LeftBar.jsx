import { X } from "lucide-react";
import { useState } from "react"
import { Link } from "react-router-dom"

const LeftBar = () => {
  const [text, setText] = useState("")
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleToggle = () => {
    setOpenDrawer(prevState => !prevState);
  }

  return (
    <>
      <div className="w-full max-w-72 h-screen fixed top-[68px] left-0 z-40">
        {openDrawer ? (
          <div className="w-full text-white pt-6 pb-4 px-2 flex flex-col border-r-1 border-gray-600"
            style={{ height: 'calc(100vh - 64px)' }}>

            <h2 className="mb-2 flex items-center justify-center">
              <span className="text-2xl font-bold">Summarize with</span>
              <span className="text-2xl ml-1 font-extrabold font-mono bg-clip-text text-transparent 
              bg-gradient-to-r from-primary to-secondary tracking-normal">- AI</span>
              <span className="pl-3">
                <X className='text-black cursor-pointer' size={18} onClick={handleToggle} />
              </span>
            </h2>

            <textarea
              className="flex-1 resize-none bg-gray-700 text-white p-2 mb-3 rounded-t-xl 
              focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search"
              value={text}
              onChange={(e) => setText(e.target.value)}/>
              
            <button className="btn bg-gradient-to-tr from-black to-gray-800 border-0 rounded-b-xl">
              <Link>
                <span className="text-lg text-white">Search</span>
              </Link>
            </button>
          </div>) : (
          <button className="btn btn-circle bg-gradient-to-tr from-gray-600 to-gray-800 border-0
           rounded-full fixed bottom-4 left-4 animate-bounce" onClick={handleToggle}>
            <span className="text-lg text-center text-white">AI</span>
          </button>
        )}
      </div>
    </>
  )
}

export default LeftBar
