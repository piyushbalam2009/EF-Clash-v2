import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Badge,
  Avatar,
  Button,
  Grid,
  Divider,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FiPlay, FiClock, FiCheck } from 'react-icons/fi'

const MotionCard = motion(Card)
transition={{ duration: 0.5, delay: matchIndex * 0.1 }}

const MatchCard = ({ match, roundIndex, matchIndex }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green'
      case 'live': return 'red'
      case 'upcoming': return 'blue'
      default: return 'gray'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FiCheck />
      case 'live': return <FiPlay />
      case 'upcoming': return <FiClock />
      default: return null
    }
  }

  return (
    <MotionCard
      bg="rgba(22, 27, 34, 0.8)"
      border="1px solid"
      borderColor={match.status === 'live' ? 'red.500' : 'gray.700'}
      size="sm"
      _hover={{
        borderColor: 'brand.500',
        transform: 'scale(1.02)',
      }}
      transition="all 0.3s ease"
      initial={{ opacity: 0, x: roundIndex % 2 === 0 ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: matchIndex * 0.1 }}
    >
      <CardBody p={3}>
        <VStack spacing={2} align="stretch">
          <HStack justify="space-between" align="center">
            <Badge
              colorScheme={getStatusColor(match.status)}
              variant="subtle"
              size="sm"
            >
              <HStack spacing={1}>
                {getStatusIcon(match.status)}
                <Text fontSize="xs">{match.status}</Text>
              </HStack>
            </Badge>
            {match.status === 'live' && (
              <Box
                w={2}
                h={2}
                bg="red.500"
                borderRadius="full"
                className="pulse"
              />
            )}
          </HStack>

          {/* Player 1 */}
          <HStack justify="space-between" align="center">
            <HStack spacing={2} flex={1}>
              <Avatar
                size="xs"
                name={match.player1?.name}
                bg="purple.500"
              />
              <Text
                fontSize="sm"
                fontWeight={match.winner === match.player1?.id ? 'bold' : 'normal'}
                color={match.winner === match.player1?.id ? 'brand.500' : 'white'}
                noOfLines={1}
              >
                {match.player1?.name || 'TBD'}
              </Text>
            </HStack>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color={match.winner === match.player1?.id ? 'brand.500' : 'gray.400'}
            >
              {match.score?.player1 ?? '-'}
            </Text>
          </HStack>

          <Divider borderColor="gray.600" />

          {/* Player 2 */}
          <HStack justify="space-between" align="center">
            <HStack spacing={2} flex={1}>
              <Avatar
                size="xs"
                name={match.player2?.name}
                bg="purple.500"
              />
              <Text
                fontSize="sm"
                fontWeight={match.winner === match.player2?.id ? 'bold' : 'normal'}
                color={match.winner === match.player2?.id ? 'brand.500' : 'white'}
                noOfLines={1}
              >
                {match.player2?.name || 'TBD'}
              </Text>
            </HStack>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color={match.winner === match.player2?.id ? 'brand.500' : 'gray.400'}
            >
              {match.score?.player2 ?? '-'}
            </Text>
          </HStack>

          {match.status === 'upcoming' && match.player1 && match.player2 && (
            <Button size="xs" variant="neon" mt={2}>
              Start Match
            </Button>
          )}
        </VStack>
      </CardBody>
    </MotionCard>
  )
}

const BracketRound = ({ round, roundIndex, totalRounds }) => {
  const getRoundName = (index, total) => {
    if (index === total - 1) return 'Final'
    if (index === total - 2) return 'Semi-Final'
    if (index === total - 3) return 'Quarter-Final'
    return `Round ${index + 1}`
  }

  return (
    <VStack spacing={4} minW="250px">
      <Text
        fontSize="lg"
        fontWeight="bold"
        fontFamily="heading"
        color="brand.500"
        textAlign="center"
      >
        {getRoundName(roundIndex, totalRounds)}
      </Text>
      <VStack spacing={6}>
        {round.matches.map((match, matchIndex) => (
          <MatchCard
            key={match.id}
            match={match}
            roundIndex={roundIndex}
            matchIndex={matchIndex}
          />
        ))}
      </VStack>
    </VStack>
  )
}

const TournamentBracket = ({ tournament }) => {
  // Mock tournament bracket data
  const bracketData = {
    rounds: [
      {
        matches: [
          {
            id: 1,
            player1: { id: 1, name: 'ProGamer123' },
            player2: { id: 2, name: 'SkillMaster' },
            status: 'completed',
            winner: 1,
            score: { player1: 3, player2: 1 }
          },
          {
            id: 2,
            player1: { id: 3, name: 'GoalMachine' },
            player2: { id: 4, name: 'TechNinja' },
            status: 'completed',
            winner: 3,
            score: { player1: 2, player2: 0 }
          },
          {
            id: 3,
            player1: { id: 5, name: 'SpeedDemon' },
            player2: { id: 6, name: 'ElitePlayer' },
            status: 'live',
            score: { player1: 1, player2: 1 }
          },
          {
            id: 4,
            player1: { id: 7, name: 'ChampionX' },
            player2: { id: 8, name: 'MasterClass' },
            status: 'upcoming'
          }
        ]
      },
      {
        matches: [
          {
            id: 5,
            player1: { id: 1, name: 'ProGamer123' },
            player2: { id: 3, name: 'GoalMachine' },
            status: 'upcoming'
          },
          {
            id: 6,
            player1: null,
            player2: null,
            status: 'pending'
          }
        ]
      },
      {
        matches: [
          {
            id: 7,
            player1: null,
            player2: null,
            status: 'pending'
          }
        ]
      }
    ]
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Box textAlign="center">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            fontFamily="heading"
            bgGradient="linear(to-r, brand.500, purple.500)"
            bgClip="text"
            mb={2}
          >
            Tournament Bracket
          </Text>
          <Text color="gray.400">
            {tournament?.name || 'Weekly Championship'}
          </Text>
        </Box>

        <Box overflowX="auto" pb={4}>
          <HStack
            spacing={8}
            align="start"
            justify="center"
            minW="fit-content"
            px={4}
          >
            {bracketData.rounds.map((round, roundIndex) => (
              <Box key={roundIndex} position="relative">
                <BracketRound
                  round={round}
                  roundIndex={roundIndex}
                  totalRounds={bracketData.rounds.length}
                />
                
                {/* Connection lines */}
                {roundIndex < bracketData.rounds.length - 1 && (
                  <Box
                    position="absolute"
                    right="-32px"
                    top="50%"
                    w="64px"
                    h="2px"
                    bg="gray.600"
                    transform="translateY(-50%)"
                    zIndex={0}
                  />
                )}
              </Box>
            ))}
          </HStack>
        </Box>

        {/* Tournament Info */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} mt={8}>
          <Card bg="rgba(22, 27, 34, 0.8)" border="1px solid" borderColor="gray.700">
            <CardBody textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                32
              </Text>
              <Text fontSize="sm" color="gray.400">Total Players</Text>
            </CardBody>
          </Card>
          <Card bg="rgba(22, 27, 34, 0.8)" border="1px solid" borderColor="gray.700">
            <CardBody textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="yellow.400">
                $500
              </Text>
              <Text fontSize="sm" color="gray.400">Prize Pool</Text>
            </CardBody>
          </Card>
          <Card bg="rgba(22, 27, 34, 0.8)" border="1px solid" borderColor="gray.700">
            <CardBody textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="green.400">
                Live
              </Text>
              <Text fontSize="sm" color="gray.400">Status</Text>
            </CardBody>
          </Card>
        </Grid>
      </VStack>
    </Box>
  )
}

export default TournamentBracket
