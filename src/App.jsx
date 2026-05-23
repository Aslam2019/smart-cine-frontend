import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'
import HomePage from './pages/HomePage'
import MoviesPage from './pages/MoviesPage'
import MovieDetailPage from './pages/MovieDetailPage'
import TheatresPage from './pages/TheatresPage'
import BookingPage from './pages/BookingPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import { useState, useEffect } from 'react'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AuthProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#111118',
            color: '#F0F0F5',
            border: '1px solid rgba(232,25,44,0.4)',
            fontFamily: 'Outfit, sans-serif',
            fontSize: '0.9rem'
          },
          success: { iconTheme: { primary: '#E8192C', secondary: '#fff' } }
        }}
      />
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Navbar />
          <Routes>
            <Route path="/"           element={<HomePage />} />
            <Route path="/movies"     element={<MoviesPage />} />
            <Route path="/movies/:id" element={<MovieDetailPage />} />
            <Route path="/theatres"   element={<TheatresPage />} />
            <Route path="/book/:showtimeId" element={<BookingPage />} />
            <Route path="/profile"    element={<ProfilePage />} />
            <Route path="/admin"      element={<AdminPage />} />
          </Routes>
          <Footer />
        </>
      )}
    </AuthProvider>
  )
}
