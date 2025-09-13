import { Routes, Route } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Tournaments from './pages/Tournaments'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'

function App() {
  return (
    <AuthProvider>
      <Box minH="100vh" bg="gray.900">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Box>
    </AuthProvider>
  )
}

export default App
