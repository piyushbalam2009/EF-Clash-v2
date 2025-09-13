import {
  Box,
  Container,
  Heading,
  Button,
  Grid,
  Card,
  CardBody,
  Badge,
  Text,
  VStack,
  HStack,
  Progress,
  Avatar,
  AvatarGroup,
  useDisclosure,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FiPlus, FiUsers, FiTrophy, FiClock } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'

const MotionCard = motion(Card)

const TournamentCard = ({ tournament, delay = 0 }) => (
  <MotionCard
    bg="rgba(22, 27, 34, 0.8)"
    backdropFilter="blur(10px)"
    border="1px solid"
    borderColor="gray.700"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    _hover={{
      borderColor: 'brand.500',
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 30px rgba(0, 255, 255, 0.2)',
    }}
    style={{ transition: 'all 0.3s ease' }}
  >
    <CardBody>
      <VStack align="start" spacing={4}>
        <HStack justify="space-between" w="full">
          <Heading size="md" fontFamily="heading">
            {tournament.name}
          </Heading>
          <Badge
            colorScheme={tournament.status === 'active' ? 'green' : 'purple'}
            variant="subtle"
          >
            {tournament.status}
          </Badge>
        </HStack>

        <Text color="gray.400" fontSize="sm">
          {tournament.description}
        </Text>

        <HStack spacing={6} w="full">
          <VStack align="start" spacing={1}>
            <HStack>
              <FiUsers size={16} />
              <Text fontSize="sm" color="gray.300">
                {tournament.participants}/{tournament.maxParticipants}
              </Text>
            </HStack>
            <Progress
              value={(tournament.participants / tournament.maxParticipants) * 100}
              size="sm"
              colorScheme="purple"
              w="100px"
            />
          </VStack>

          <VStack align="start" spacing={1}>
            <HStack>
              <FiTrophy size={16} />
              <Text fontSize="sm" color="brand.500" fontWeight="bold">
                ${tournament.prize}
              </Text>
            </HStack>
          </VStack>
        </HStack>

        <HStack justify="space-between" w="full">
          <AvatarGroup size="sm" max={3}>
            {tournament.topPlayers?.map((player, index) => (
              <Avatar key={index} name={player} bg="purple.500" />
            ))}
          </AvatarGroup>

          <Button
            size="sm"
            variant={tournament.status === 'active' ? 'neon' : 'purple'}
            rightIcon={tournament.status === 'active' ? <FiUsers /> : <FiClock />}
          >
            {tournament.status === 'active' ? 'Join' : 'Starting Soon'}
          </Button>
        </HStack>
      </VStack>
    </CardBody>
  </MotionCard>
)

const Tournaments = () => {
  const { user } = useAuth()

  // Mock tournament data
  const tournaments = [
    {
      id: 1,
      name: 'Weekly Championship',
      description: 'Compete for the weekly crown and exclusive rewards',
      status: 'active',
      participants: 24,
      maxParticipants: 32,
      prize: 500,
      topPlayers: ['Player1', 'Player2', 'Player3']
    },
    {
      id: 2,
      name: 'Rookie League',
      description: 'Perfect for new players to get started',
      status: 'registering',
      participants: 8,
      maxParticipants: 16,
      prize: 100,
      topPlayers: ['NewPlayer1', 'NewPlayer2']
    },
    {
      id: 3,
      name: 'Pro Masters',
      description: 'Elite tournament for experienced players only',
      status: 'active',
      participants: 16,
      maxParticipants: 16,
      prize: 1000,
      topPlayers: ['ProPlayer1', 'ProPlayer2', 'ProPlayer3']
    }
  ]

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between" align="center">
          <VStack align="start" spacing={2}>
            <Heading
              size="xl"
              fontFamily="heading"
              bgGradient="linear(to-r, brand.500, purple.500)"
              bgClip="text"
            >
              Tournaments
            </Heading>
            <Text color="gray.400">
              Join competitive tournaments and climb the rankings
            </Text>
          </VStack>

          {user && (
            <Button
              leftIcon={<FiPlus />}
              variant="purple"
              fontFamily="heading"
            >
              Create Tournament
            </Button>
          )}
        </HStack>

        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
          gap={6}
        >
          {tournaments.map((tournament, index) => (
            <TournamentCard
              key={tournament.id}
              tournament={tournament}
              delay={index * 0.1}
            />
          ))}
        </Grid>
      </VStack>
    </Container>
  )
}

export default Tournaments
