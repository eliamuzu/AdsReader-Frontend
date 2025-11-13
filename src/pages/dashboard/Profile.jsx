import { useState } from 'react'
import { useSidebar } from '../../contexts/SidebarContext'

export default function Profile() {
   const { toggleSidebar } = useSidebar()
  


  return (
    <div>
      <div className="fixed top-0 left-[260px] w-[calc(100%-260px)] h-[60px] bg-transparent backdrop-blur-sm flex justify-between items-center gap-2 px-4 shadow-md z-[2000] transition-all duration-300 max-md:left-0 max-md:w-full">
       <button
        onClick={toggleSidebar}
        className="bg-transparent border-none p-2 rounded text-gray-800 hover:bg-gray-100 cursor-pointer md:hidden"
        aria-label="Toggle sidebar"
      >
        <span className="material-symbols-outlined text-2xl">menu</span>
      </button>
      </div>

      <div className="p-5">
        <div className="mt-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Profile</h2>
            <p className="text-gray-600">Profile content will be displayed here.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

