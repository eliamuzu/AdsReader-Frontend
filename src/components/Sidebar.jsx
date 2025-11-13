import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import logoImage from '../../Assets/images/Picture1.png'
import { useSidebar } from '../contexts/SidebarContext'

export default function Sidebar({ onStateChange, onToggle }) {
  const { sidebarClosed: isClosed, setSidebarClosed, isMobile, setIsMobile } = useSidebar()
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  useEffect(() => {
    if (onStateChange) {
      onStateChange(isClosed, isMobile)
    }
  }, [isClosed, isMobile, onStateChange])

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      if (mobile) {
        setSidebarClosed(true)
      } else {
        setSidebarClosed(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setIsMobile, setSidebarClosed])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const menuItems = [
    { path: '/home', icon: 'home', label: 'Home' },
    { path: '/overview', icon: 'overview', label: 'Overview' },
    { path: '/analytics', icon: 'monitoring', label: 'Dashboard' },
  ]

  const accountItems = [
    { path: '/profile', icon: 'account_circle', label: 'Profile' },
    { path: '/settings', icon: 'settings', label: 'Settings' },
  ]

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen w-[260px] bg-sidebar p-6 shadow-lg transition-all duration-300 z-[100] flex flex-col overflow-x-hidden ${
          isMobile
            ? isClosed
              ? '-translate-x-full'
              : 'translate-x-0'
            : isClosed
            ? 'w-[100px]'
            : 'w-[260px]'
        }`}
      >
        <div className="flex items-center justify-center mb-8 text-white font-bitcount text-[34px] px-2.5 transition-all">
          <img
            src={logoImage}
            alt="Logo"
            className={`transition-all ${
              isClosed && !isMobile ? 'w-[60px] h-[60px] mx-auto' : 'w-20 h-20'
            }`}
          />
        </div>

        <ul className="list-none mt-5 h-[80%] overflow-y-auto scrollbar-none">
          <div className="text-white font-medium whitespace-nowrap my-2.5 pb-2.5 flex items-center gap-2">
            <span className={`transition-opacity duration-300 ${isClosed && !isMobile ? 'opacity-0 w-0' : 'opacity-100 flex-1'}`}>
              Main Menu
            </span>
            <div className={`flex-shrink-0 h-px bg-white transition-all duration-300 ${
              isClosed && !isMobile ? 'w-0' : 'flex-1'
            }`} />
          </div>

          {menuItems.map((item) => (
            <li key={item.path} className='mb-2'>
              <Link
                to={item.path}
                className={`flex items-center gap-0 font-medium whitespace-nowrap py-4 px-2.5 no-underline transition-all rounded ${
                  isClosed && !isMobile
                    ? 'justify-center px-1.5 gap-10'
                    : 'gap-[30px]'
                } ${
                  isActive(item.path)
                    ? 'bg-white text-[#161a2d]'
                    : 'text-white hover:bg-white hover:top-[2px] hover:text-[#161a2d]'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">
                  {item.icon}
                </span>
                {(!isClosed || isMobile) && <span>{item.label}</span>}
              </Link>
            </li>
          ))}

          <div className="text-white font-medium whitespace-nowrap my-2.5 pb-2.5 flex items-center gap-2 mt-6">
            <span className={`transition-opacity duration-300 ${isClosed && !isMobile ? 'opacity-0 w-0' : 'opacity-100 flex-1'}`}>
              Account
            </span>
            <div className={`flex-shrink-0 h-px bg-white transition-all duration-300 ${
              isClosed && !isMobile ? 'w-0' : 'flex-1'
            }`} />
          </div>

          {accountItems.map((item) => (
            <li key={item.path} className='mb-2'>
              <Link
                to={item.path}
                className={`flex items-center gap-0 font-medium whitespace-nowrap py-4 px-2.5 no-underline transition-all rounded ${
                  isClosed && !isMobile
                    ? 'justify-center px-1.5 gap-0'
                    : 'gap-[30px]'
                } ${
                  isActive(item.path)
                    ? 'bg-white text-[#161a2d]'
                    : 'text-white hover:bg-white hover:text-[#161a2d]'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">
                  {item.icon}
                </span>
                {(!isClosed || isMobile) && <span>{item.label}</span>}
              </Link>
            </li>
          ))}

          <li className="relative mt-auto">
            <button
              onClick={handleLogout}
              className={`flex items-center gap-0 text-white font-medium whitespace-nowrap py-4 px-2.5 no-underline transition-all rounded w-full text-left ${
                isClosed && !isMobile
                  ? 'justify-center px-1.5 gap-0'
                  : 'gap-[30px]'
              } hover:bg-white hover:text-[#161a2d]`}
            >
              <span className="material-symbols-outlined text-2xl">logout</span>
              {(!isClosed || isMobile) && <span>Logout</span>}
            </button>
          </li>
        </ul>
      </aside>

      {isMobile && !isClosed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[90]"
          onClick={() => setSidebarClosed(true)}
        />
      )}
    </>
  )
}

