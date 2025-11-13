import { createContext, useContext, useState } from 'react'

const SidebarContext = createContext()

export function SidebarProvider({ children }) {
  const [sidebarClosed, setSidebarClosed] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  const toggleSidebar = () => {
    setSidebarClosed((prev) => !prev)
  }

  const value = {
    sidebarClosed,
    setSidebarClosed,
    isMobile,
    setIsMobile,
    toggleSidebar,
  }

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider')
  }
  return context
}
