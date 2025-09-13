import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Divider,
  Alert,
  AlertIcon,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FcGoogle } from 'react-icons/fc'
import { useAuth } from '../contexts/AuthContext'

const MotionModalContent = motion(ModalContent)

const AuthModal = ({ isOpen, onClose }) => {
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const toast = useToast()

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
    } else {
      toast({
        title: 'Welcome back!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      onClose()
      resetForm()
    }
    setLoading(false)
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    const { error } = await signUp(email, password, {
      username,
      full_name: username,
    })
    
    if (error) {
      setError(error.message)
    } else {
      toast({
        title: 'Account created!',
        description: 'Please check your email to verify your account.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      onClose()
      resetForm()
    }
    setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    const { error } = await signInWithGoogle()
    
    if (error) {
      setError(error.message)
      setLoading(false)
    }
    // Don't reset loading here as user will be redirected
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setUsername('')
    setError('')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(10px)" />
      <MotionModalContent
        bg="gray.800"
        border="1px solid"
        borderColor="gray.600"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ModalHeader
          fontFamily="heading"
          bgGradient="linear(to-r, brand.500, purple.500)"
          bgClip="text"
        >
          Join EF Clash
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Tabs variant="soft-rounded" colorScheme="purple">
            <TabList mb={4}>
              <Tab flex={1}>Sign In</Tab>
              <Tab flex={1}>Sign Up</Tab>
            </TabList>

            <TabPanels>
              {/* Sign In Panel */}
              <TabPanel p={0}>
                <VStack spacing={4}>
                  {error && (
                    <Alert status="error" borderRadius="md">
                      <AlertIcon />
                      {error}
                    </Alert>
                  )}

                  <Button
                    leftIcon={<FcGoogle />}
                    onClick={handleGoogleSignIn}
                    isLoading={loading}
                    loadingText="Signing in..."
                    w="full"
                    variant="outline"
                    borderColor="gray.600"
                    _hover={{ borderColor: 'brand.500' }}
                  >
                    Continue with Google
                  </Button>

                  <Divider />

                  <form onSubmit={handleSignIn} style={{ width: '100%' }}>
                    <VStack spacing={4}>
                      <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          focusBorderColor="brand.500"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Password</FormLabel>
                        <Input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          focusBorderColor="brand.500"
                        />
                      </FormControl>

                      <Button
                        type="submit"
                        variant="purple"
                        w="full"
                        isLoading={loading}
                        loadingText="Signing in..."
                      >
                        Sign In
                      </Button>
                    </VStack>
                  </form>
                </VStack>
              </TabPanel>

              {/* Sign Up Panel */}
              <TabPanel p={0}>
                <VStack spacing={4}>
                  {error && (
                    <Alert status="error" borderRadius="md">
                      <AlertIcon />
                      {error}
                    </Alert>
                  )}

                  <Button
                    leftIcon={<FcGoogle />}
                    onClick={handleGoogleSignIn}
                    isLoading={loading}
                    loadingText="Signing up..."
                    w="full"
                    variant="outline"
                    borderColor="gray.600"
                    _hover={{ borderColor: 'brand.500' }}
                  >
                    Continue with Google
                  </Button>

                  <Divider />

                  <form onSubmit={handleSignUp} style={{ width: '100%' }}>
                    <VStack spacing={4}>
                      <FormControl>
                        <FormLabel>Username</FormLabel>
                        <Input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          focusBorderColor="brand.500"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          focusBorderColor="brand.500"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Password</FormLabel>
                        <Input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          focusBorderColor="brand.500"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Confirm Password</FormLabel>
                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          focusBorderColor="brand.500"
                        />
                      </FormControl>

                      <Button
                        type="submit"
                        variant="purple"
                        w="full"
                        isLoading={loading}
                        loadingText="Creating account..."
                      >
                        Create Account
                      </Button>
                    </VStack>
                  </form>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>

          <Text mt={4} fontSize="sm" color="gray.400" textAlign="center">
            By signing up, you agree to compete fairly in tournaments
          </Text>
        </ModalBody>
      </MotionModalContent>
    </Modal>
  )
}

export default AuthModal
