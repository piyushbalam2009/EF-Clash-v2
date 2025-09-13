import { Box, Spinner, VStack, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const LoadingSpinner = ({ 
  size = 'xl', 
  message = 'Loading...', 
  variant = 'gaming' 
}) => {
  if (variant === 'gaming') {
    return (
      <VStack spacing={4} justify="center" align="center" minH="200px">
        <MotionBox
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Box
            w="60px"
            h="60px"
            border="4px solid"
            borderColor="gray.700"
            borderTopColor="brand.500"
            borderRadius="full"
            className="neon-glow"
          />
        </MotionBox>
        <Text color="gray.400" fontSize="sm" fontFamily="heading">
          {message}
        </Text>
      </VStack>
    )
  }

  if (variant === 'pulse') {
    return (
      <VStack spacing={4} justify="center" align="center" minH="200px">
        <MotionBox
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Box
            w="40px"
            h="40px"
            bg="brand.500"
            borderRadius="full"
            className="neon-glow"
          />
        </MotionBox>
        <Text color="gray.400" fontSize="sm">
          {message}
        </Text>
      </VStack>
    )
  }

  return (
    <VStack spacing={4} justify="center" align="center" minH="200px">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.700"
        color="brand.500"
        size={size}
      />
      <Text color="gray.400" fontSize="sm">
        {message}
      </Text>
    </VStack>
  )
}

export default LoadingSpinner
