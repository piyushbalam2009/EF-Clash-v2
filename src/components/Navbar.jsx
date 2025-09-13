import {
  Box,
  Flex,
  Text,
  Button,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  HStack,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMenu, FiX, FiUser, FiLogOut, FiTrophy, FiHome, FiUsers } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from './AuthModal'

const MotionBox = motion(Box)

const NavLink = ({ to, children, icon }) => {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Button
      as={Link}
      to={to}
      variant="ghost"
      color={isActive ? 'brand.500' : 'gray.300'}
      _hover={{
        color: 'brand.500',
        transform: 'translateY(-2px)',
        textShadow: '0 0 8px rgba(0, 255, 255, 0.6)',
      }}
      leftIcon={icon}
      fontFamily="heading"
      fontWeight="600"
      transition="all 0.3s ease"
    >
      {children}
    </Button>
  )
}

const Navbar = () => {
  const { user, signOut } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isMobileOpen, onToggle: onMobileToggle } = useDisclosure()
  const isMobile = useBreakpointValue({ base: true, md: false })

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <MotionBox
      as="nav"
      bg="rgba(13, 17, 23, 0.95)"
      backdropFilter="blur(10px)"
      borderBottom="1px solid"
      borderColor="gray.700"
      position="sticky"
      top={0}
      zIndex={1000}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Flex
        maxW="7xl"
        mx="auto"
        px={4}
        py={3}
        align="center"
        justify="space-between"
      >
        {/* Logo */}
        <MotionBox
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Text
            as={Link}
            to="/"
            fontSize="2xl"
            fontWeight="900"
            fontFamily="heading"
            bgGradient="linear(to-r, brand.500, purple.500)"
            bgClip="text"
            textDecoration="none"
            _hover={{ textDecoration: 'none' }}
          >
            ⚡ EF CLASH
          </Text>
        </MotionBox>

        {/* Desktop Navigation */}
        {!isMobile && (
          <HStack spacing={6}>
            <NavLink to="/" icon={<FiHome />}>
              Home
            </NavLink>
            <NavLink to="/tournaments" icon={<FiTrophy />}>
              Tournaments
            </NavLink>
            <NavLink to="/leaderboard" icon={<FiUsers />}>
              Leaderboard
            </NavLink>
          </HStack>
        )}

        {/* User Menu / Auth */}
        <Flex align="center" gap={4}>
          {user ? (
            <Menu>
              <MenuButton>
                <Avatar
                  size="sm"
                  src={user.user_metadata?.avatar_url}
                  name={user.user_metadata?.full_name || user.email}
                  bg="purple.500"
                  cursor="pointer"
                  _hover={{
                    transform: 'scale(1.1)',
                    boxShadow: '0 0 15px rgba(139, 92, 246, 0.6)',
                  }}
                  transition="all 0.3s ease"
                />
              </MenuButton>
              <MenuList bg="gray.800" borderColor="gray.600">
                <MenuItem
                  as={Link}
                  to="/profile"
                  icon={<FiUser />}
                  _hover={{ bg: 'gray.700' }}
                >
                  Profile
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  icon={<FiLogOut />}
                  onClick={handleSignOut}
                  _hover={{ bg: 'gray.700' }}
                >
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button
              variant="neon"
              onClick={onOpen}
              size="sm"
              fontFamily="heading"
            >
              Sign In
            </Button>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              icon={isMobileOpen ? <FiX /> : <FiMenu />}
              variant="ghost"
              color="brand.500"
              onClick={onMobileToggle}
              aria-label="Toggle Navigation"
            />
          )}
        </Flex>
      </Flex>

      {/* Mobile Navigation */}
      {isMobile && isMobileOpen && (
        <MotionBox
          bg="rgba(22, 27, 34, 0.98)"
          backdropFilter="blur(10px)"
          borderTop="1px solid"
          borderColor="gray.700"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Flex direction="column" p={4} gap={2}>
            <NavLink to="/" icon={<FiHome />}>
              Home
            </NavLink>
            <NavLink to="/tournaments" icon={<FiTrophy />}>
              Tournaments
            </NavLink>
            <NavLink to="/leaderboard" icon={<FiUsers />}>
              Leaderboard
            </NavLink>
          </Flex>
        </MotionBox>
      )}

      <AuthModal isOpen={isOpen} onClose={onClose} />
    </MotionBox>
  )
}

export default Navbar
