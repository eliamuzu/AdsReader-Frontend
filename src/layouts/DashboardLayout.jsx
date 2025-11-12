import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

export default function DashboardLayout() {
  const [sidebarClosed, setSidebarClosed] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  return (
    <div className="flex">
      <Sidebar onStateChange={(closed, mobile) => { setSidebarClosed(closed); setIsMobile(mobile) }} />
      <main
        className={`mt-[60px] min-h-screen transition-all duration-300 bg-gray-50 overflow-x-hidden ${
          isMobile
            ? 'ml-0 w-full'
            : sidebarClosed
            ? 'ml-[100px] w-[calc(100vw-100px)]'
            : 'ml-[260px] w-[calc(100vw-260px)]'
        }`}
      >
        <Outlet />
      </main>
    </div>
  )
}

