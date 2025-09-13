import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Grid,
  GridItem,
  Card,
  CardBody,
  Icon,
  useDisclosure,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FiTrophy, FiUsers, FiZap, FiTarget, FiAward, FiGamepad2 } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from '../components/AuthModal'
import AnimatedBackground from '../components/AnimatedBackground'

const MotionBox = motion(Box)
const MotionCard = motion(Card)

const FeatureCard = ({ icon, title, description, delay = 0 }) => (
  <MotionCard
    bg="rgba(22, 27, 34, 0.8)"
    backdropFilter="blur(10px)"
    border="1px solid"
    borderColor="gray.700"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    _hover={{
      borderColor: 'brand.500',
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 30px rgba(0, 255, 255, 0.2)',
    }}
    style={{ transition: 'all 0.3s ease' }}
  >
    <CardBody textAlign="center" p={6}>
      <Icon
        as={icon}
        boxSize={12}
        color="brand.500"
        mb={4}
        className="neon-glow"
      />
      <Heading size="md" mb={2} fontFamily="heading">
        {title}
      </Heading>
      <Text color="gray.400" fontSize="sm">
        {description}
      </Text>
    </CardBody>
  </MotionCard>
)

const StatCard = ({ number, label, delay = 0 }) => (
  <MotionBox
    textAlign="center"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
  >
    <Text
      fontSize="4xl"
      fontWeight="900"
      fontFamily="heading"
      bgGradient="linear(to-r, brand.500, purple.500)"
      bgClip="text"
    >
      {number}
    </Text>
    <Text color="gray.400" fontSize="sm">
      {label}
    </Text>
  </MotionBox>
)

const Home = () => {
  const { user } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box position="relative">
      <AnimatedBackground variant="particles" />
      {/* Hero Section */}
      <Container maxW="7xl" py={20}>
        <VStack spacing={8} textAlign="center">
          <MotionBox
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Heading
              size="4xl"
              fontFamily="heading"
              bgGradient="linear(to-r, brand.500, purple.500)"
              bgClip="text"
              mb={4}
            >
              Welcome to EF Clash
            </Heading>
            <Text fontSize="xl" color="gray.300" maxW="2xl" mx="auto">
              The ultimate eFootball tournament platform. Compete with players worldwide,
              climb the leaderboards, and prove you're the champion.
            </Text>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <HStack spacing={4} flexWrap="wrap" justify="center">
              {user ? (
                <Button
                  size="lg"
                  variant="purple"
                  rightIcon={<FiTrophy />}
                  fontFamily="heading"
                  px={8}
                >
                  Join Tournament
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="neon"
                  rightIcon={<FiZap />}
                  fontFamily="heading"
                  px={8}
                  onClick={onOpen}
                >
                  Get Started
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                borderColor="gray.600"
                _hover={{ borderColor: 'brand.500' }}
                rightIcon={<FiUsers />}
                fontFamily="heading"
                px={8}
              >
                View Leaderboard
              </Button>
            </HStack>
          </MotionBox>
        </VStack>
      </Container>

      {/* Stats Section */}
      <Box bg="rgba(22, 27, 34, 0.5)" py={16}>
        <Container maxW="7xl">
          <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={8}>
            <StatCard number="1000+" label="Active Players" delay={0.1} />
            <StatCard number="50+" label="Tournaments" delay={0.2} />
            <StatCard number="5000+" label="Matches Played" delay={0.3} />
            <StatCard number="24/7" label="Live Action" delay={0.4} />
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="7xl" py={20}>
        <VStack spacing={12}>
          <MotionBox
            textAlign="center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Heading
              size="2xl"
              fontFamily="heading"
              mb={4}
              bgGradient="linear(to-r, brand.500, purple.500)"
              bgClip="text"
            >
              Why Choose EF Clash?
            </Heading>
            <Text color="gray.400" maxW="2xl" mx="auto">
              Experience the future of competitive eFootball with our cutting-edge platform
            </Text>
          </MotionBox>

          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
            gap={8}
            w="full"
          >
            <FeatureCard
              icon={FiTrophy}
              title="Tournament System"
              description="Join organized tournaments with bracket progression and real prizes"
              delay={0.1}
            />
            <FeatureCard
              icon={FiTarget}
              title="AI Verification"
              description="Advanced AI technology verifies match results from screenshots"
              delay={0.2}
            />
            <FeatureCard
              icon={FiUsers}
              title="Global Leaderboards"
              description="Compete with players worldwide and climb the rankings"
              delay={0.3}
            />
            <FeatureCard
              icon={FiAward}
              title="Achievement System"
              description="Unlock badges and achievements as you progress"
              delay={0.4}
            />
            <FeatureCard
              icon={FiGamepad2}
              title="Match Tracking"
              description="Detailed match history and performance analytics"
              delay={0.5}
            />
            <FeatureCard
              icon={FiZap}
              title="Real-time Updates"
              description="Live tournament brackets and instant match notifications"
              delay={0.6}
            />
          </Grid>
        </VStack>
      </Container>

      {/* CTA Section */}
      <Box bg="rgba(139, 92, 246, 0.1)" py={20}>
        <Container maxW="4xl" textAlign="center">
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Heading size="xl" fontFamily="heading" mb={4}>
              Ready to Dominate?
            </Heading>
            <Text color="gray.400" mb={8} fontSize="lg">
              Join thousands of players in the ultimate eFootball competition
            </Text>
            {!user && (
              <Button
                size="lg"
                variant="purple"
                rightIcon={<FiTrophy />}
                fontFamily="heading"
                px={12}
                onClick={onOpen}
              >
                Start Your Journey
              </Button>
            )}
          </MotionBox>
        </Container>
      </Box>

      <AuthModal isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}

export default Home
