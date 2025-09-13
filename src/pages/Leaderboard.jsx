import {
  Box,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Badge,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  Progress,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FiTrophy, FiTarget, FiTrendingUp } from 'react-icons/fi'

const MotionTr = motion(Tr)

const LeaderboardRow = ({ player, index, delay = 0 }) => {
  const getRankColor = (rank) => {
    if (rank === 1) return 'yellow.400'
    if (rank === 2) return 'gray.300'
    if (rank === 3) return 'orange.400'
    return 'gray.500'
  }

  const getRankIcon = (rank) => {
    if (rank <= 3) return <FiTrophy />
    return rank
  }

  return (
    <MotionTr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      _hover={{ bg: 'rgba(139, 92, 246, 0.1)' }}
    >
      <Td>
        <HStack>
          <Box color={getRankColor(index + 1)} fontSize="lg" fontWeight="bold">
            {getRankIcon(index + 1)}
          </Box>
        </HStack>
      </Td>
      <Td>
        <HStack>
          <Avatar size="sm" name={player.name} bg="purple.500" />
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold">{player.name}</Text>
            <Text fontSize="xs" color="gray.400">{player.country}</Text>
          </VStack>
        </HStack>
      </Td>
      <Td>
        <Text fontWeight="bold" color="brand.500">{player.points}</Text>
      </Td>
      <Td>
        <Text>{player.wins}</Text>
      </Td>
      <Td>
        <Text>{player.losses}</Text>
      </Td>
      <Td>
        <Text>{player.winRate}%</Text>
      </Td>
      <Td>
        <Badge
          colorScheme={player.streak > 0 ? 'green' : 'red'}
          variant="subtle"
        >
          {player.streak > 0 ? '+' : ''}{player.streak}
        </Badge>
      </Td>
    </MotionTr>
  )
}

const StatCard = ({ icon, title, value, subtitle, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card bg="rgba(22, 27, 34, 0.8)" border="1px solid" borderColor="gray.700">
      <CardBody>
        <HStack spacing={4}>
          <Box color="brand.500" fontSize="2xl">
            {icon}
          </Box>
          <VStack align="start" spacing={1}>
            <Text fontSize="2xl" fontWeight="bold" fontFamily="heading">
              {value}
            </Text>
            <Text fontSize="sm" color="gray.400">{title}</Text>
            {subtitle && (
              <Text fontSize="xs" color="gray.500">{subtitle}</Text>
            )}
          </VStack>
        </HStack>
      </CardBody>
    </Card>
  </motion.div>
)

const Leaderboard = () => {
  // Mock leaderboard data
  const players = [
    { name: 'ProGamer123', country: 'Brazil', points: 2450, wins: 89, losses: 11, winRate: 89, streak: 7 },
    { name: 'SkillMaster', country: 'Spain', points: 2380, wins: 76, losses: 14, winRate: 84, streak: 4 },
    { name: 'GoalMachine', country: 'Argentina', points: 2320, wins: 82, losses: 18, winRate: 82, streak: -2 },
    { name: 'TechNinja', country: 'Japan', points: 2280, wins: 71, losses: 19, winRate: 79, streak: 3 },
    { name: 'SpeedDemon', country: 'Germany', points: 2240, wins: 68, losses: 22, winRate: 76, streak: 1 },
    { name: 'ElitePlayer', country: 'France', points: 2200, wins: 65, losses: 25, winRate: 72, streak: -1 },
    { name: 'ChampionX', country: 'England', points: 2180, wins: 63, losses: 27, winRate: 70, streak: 2 },
    { name: 'MasterClass', country: 'Italy', points: 2150, wins: 61, losses: 29, winRate: 68, streak: -3 },
  ]

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        <VStack align="start" spacing={2}>
          <Heading
            size="xl"
            fontFamily="heading"
            bgGradient="linear(to-r, brand.500, purple.500)"
            bgClip="text"
          >
            Global Leaderboard
          </Heading>
          <Text color="gray.400">
            Top players competing in EF Clash tournaments
          </Text>
        </VStack>

        {/* Stats Cards */}
        <HStack spacing={6} overflowX="auto" pb={4}>
          <StatCard
            icon={<FiTrophy />}
            title="Total Players"
            value="1,247"
            subtitle="Active this month"
            delay={0.1}
          />
          <StatCard
            icon={<FiTarget />}
            title="Matches Today"
            value="156"
            subtitle="Live tournaments"
            delay={0.2}
          />
          <StatCard
            icon={<FiTrendingUp />}
            title="Prize Pool"
            value="$12,500"
            subtitle="This week"
            delay={0.3}
          />
        </HStack>

        {/* Leaderboard Table */}
        <Card bg="rgba(22, 27, 34, 0.8)" border="1px solid" borderColor="gray.700">
          <CardBody p={0}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th color="gray.400">Rank</Th>
                  <Th color="gray.400">Player</Th>
                  <Th color="gray.400">Points</Th>
                  <Th color="gray.400">Wins</Th>
                  <Th color="gray.400">Losses</Th>
                  <Th color="gray.400">Win Rate</Th>
                  <Th color="gray.400">Streak</Th>
                </Tr>
              </Thead>
              <Tbody>
                {players.map((player, index) => (
                  <LeaderboardRow
                    key={player.name}
                    player={player}
                    index={index}
                    delay={index * 0.1}
                  />
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  )
}

export default Leaderboard
