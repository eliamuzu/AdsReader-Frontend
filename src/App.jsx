import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { SidebarProvider } from './contexts/SidebarContext'
import {FilterProvider} from './contexts/FilterContext'
import LoadingIndicator from './components/LoadingIndicator'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import DashboardLayout from './layouts/DashboardLayout'
import Home from './pages/dashboard/Home'
import Overview from './pages/dashboard/Overview'
import Analytics from './pages/dashboard/Analytics'
import Profile from './pages/dashboard/Profile'
import Settings from './pages/dashboard/Settings'

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth(); // Add loading state

  if (loading) {
    // Show a loading indicator while authentication state is being determined
    return <LoadingIndicator message="Loading..." />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth(); // Add loading state

  if (loading) {
    // Show a loading indicator while authentication state is being determined
    return (
      <div className='h-full flex items-center justify-center'>
        <LoadingIndicator message="Loading..." />
      </div>
    )
      
  }

  return !isAuthenticated ? children : <Navigate to="/home" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
      
      <Route path="/" element={<PrivateRoute><SidebarProvider><DashboardLayout /></SidebarProvider></PrivateRoute>}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="overview" element={<Overview />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <FilterProvider>
          <AppRoutes />
        </FilterProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

