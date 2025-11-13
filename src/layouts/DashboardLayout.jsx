import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useSidebar } from '../contexts/SidebarContext'

export default function DashboardLayout() {
  const { sidebarClosed, setSidebarClosed, isMobile, setIsMobile, toggleSidebar } = useSidebar()

  return (
    <div className="flex">
      <Sidebar onStateChange={(closed, mobile) => { setSidebarClosed(closed); setIsMobile(mobile) }} onToggle={toggleSidebar} />
      
      {/* Mobile topbar with toggle button */}
      {isMobile && (
        <div className="fixed top-0 left-0 w-full h-[60px] bg-white shadow-md z-[500] flex items-center px-4 md:hidden">
          <button
            onClick={toggleSidebar}
            className="bg-transparent border-none p-2 rounded text-gray-800 hover:bg-gray-100 cursor-pointer"
            aria-label="Toggle sidebar"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
        </div>
      )}

      <main
        className={`transition-all duration-300 bg-gray-50 overflow-x-hidden ${
          isMobile
            ? 'mt-[60px] ml-0 w-full'
            : sidebarClosed
            ? 'mt-[60px] ml-[100px] w-[calc(100vw-100px)]'
            : 'mt-[60px] ml-[260px] w-[calc(100vw-260px)]'
        }`}
      >
        <Outlet />
      </main>
    </div>
  )
}

