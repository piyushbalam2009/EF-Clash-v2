import { Box } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const MotionBox = motion(Box)

const Particle = ({ index }) => {
  const [position, setPosition] = useState({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      })
    }, 10000 + Math.random() * 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <MotionBox
      position="absolute"
      w="2px"
      h="2px"
      bg="brand.500"
      borderRadius="full"
      opacity={0.6}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        ease: "linear",
      }}
      style={{
        boxShadow: '0 0 6px rgba(0, 255, 255, 0.8)',
      }}
    />
  )
}

const GridLine = ({ isVertical, position, delay = 0 }) => (
  <MotionBox
    position="absolute"
    bg="linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)"
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 0.5, 0] }}
    transition={{
      duration: 3,
      repeat: Infinity,
      delay,
    }}
    {...(isVertical ? {
      left: `${position}%`,
      top: 0,
      bottom: 0,
      w: "1px",
    } : {
      top: `${position}%`,
      left: 0,
      right: 0,
      h: "1px",
    })}
  />
)

const AnimatedBackground = ({ variant = 'particles' }) => {
  const [particles] = useState(
    Array.from({ length: 50 }, (_, i) => i)
  )

  if (variant === 'particles') {
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={-1}
        overflow="hidden"
        pointerEvents="none"
      >
        {particles.map((index) => (
          <Particle key={index} index={index} />
        ))}
      </Box>
    )
  }

  if (variant === 'grid') {
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={-1}
        overflow="hidden"
        pointerEvents="none"
      >
        {/* Vertical lines */}
        {Array.from({ length: 10 }, (_, i) => (
          <GridLine
            key={`v-${i}`}
            isVertical
            position={i * 10}
            delay={i * 0.5}
          />
        ))}
        {/* Horizontal lines */}
        {Array.from({ length: 8 }, (_, i) => (
          <GridLine
            key={`h-${i}`}
            isVertical={false}
            position={i * 12.5}
            delay={i * 0.3}
          />
        ))}
      </Box>
    )
  }

  if (variant === 'waves') {
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={-1}
        overflow="hidden"
        pointerEvents="none"
      >
        <MotionBox
          position="absolute"
          top="50%"
          left="50%"
          w="200vw"
          h="200vw"
          borderRadius="full"
          border="1px solid"
          borderColor="rgba(0, 255, 255, 0.1)"
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            transform: 'translate(-50%, -50%)',
          }}
        />
        <MotionBox
          position="absolute"
          top="50%"
          left="50%"
          w="150vw"
          h="150vw"
          borderRadius="full"
          border="1px solid"
          borderColor="rgba(139, 92, 246, 0.1)"
          animate={{
            scale: [1.2, 0.8, 1.2],
            rotate: [360, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            transform: 'translate(-50%, -50%)',
          }}
        />
      </Box>
    )
  }

  return null
}

export default AnimatedBackground
