import {
  Box,
  Container,
  Heading,
  Text,
  Avatar,
  VStack,
  HStack,
  Grid,
  Card,
  CardBody,
  Badge,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Divider,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FiEdit, FiTrophy, FiTarget, FiTrendingUp, FiAward } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'

const MotionCard = motion(Card)

const StatCard = ({ icon, label, value, helpText, color = 'brand.500', delay = 0 }) => (
  <MotionCard
    bg="rgba(22, 27, 34, 0.8)"
    border="1px solid"
    borderColor="gray.700"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <CardBody>
      <Stat>
        <HStack mb={2}>
          <Box color={color} fontSize="xl">
            {icon}
          </Box>
          <StatLabel color="gray.400">{label}</StatLabel>
        </HStack>
        <StatNumber fontFamily="heading" color={color}>
          {value}
        </StatNumber>
        {helpText && (
          <StatHelpText color="gray.500">{helpText}</StatHelpText>
        )}
      </Stat>
    </CardBody>
  </MotionCard>
)

const AchievementBadge = ({ title, description, earned = false, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card
      bg={earned ? 'rgba(139, 92, 246, 0.2)' : 'rgba(22, 27, 34, 0.8)'}
      border="1px solid"
      borderColor={earned ? 'purple.500' : 'gray.700'}
      opacity={earned ? 1 : 0.6}
    >
      <CardBody textAlign="center" p={4}>
        <Box fontSize="2xl" mb={2}>
          {earned ? '🏆' : '🔒'}
        </Box>
        <Text fontSize="sm" fontWeight="bold" mb={1}>
          {title}
        </Text>
        <Text fontSize="xs" color="gray.400">
          {description}
        </Text>
      </CardBody>
    </Card>
  </motion.div>
)

const Profile = () => {
  const { user } = useAuth()

  // Mock user stats
  const userStats = {
    totalMatches: 45,
    wins: 32,
    losses: 13,
    winRate: 71,
    currentStreak: 5,
    bestStreak: 12,
    totalPoints: 1850,
    rank: 156,
    tournamentsWon: 3,
    goalsScored: 128,
    cleanSheets: 18
  }

  const achievements = [
    { title: 'First Victory', description: 'Win your first match', earned: true },
    { title: 'Winning Streak', description: 'Win 5 matches in a row', earned: true },
    { title: 'Tournament Champion', description: 'Win a tournament', earned: true },
    { title: 'Goal Machine', description: 'Score 100 goals', earned: true },
    { title: 'Undefeated', description: 'Win 10 matches without losing', earned: false },
    { title: 'Master Class', description: 'Reach top 100 ranking', earned: false },
  ]

  if (!user) {
    return (
      <Container maxW="4xl" py={20} textAlign="center">
        <Text color="gray.400">Please sign in to view your profile</Text>
      </Container>
    )
  }

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card bg="rgba(22, 27, 34, 0.8)" border="1px solid" borderColor="gray.700">
            <CardBody>
              <HStack spacing={6} align="start">
                <Avatar
                  size="2xl"
                  src={user.user_metadata?.avatar_url}
                  name={user.user_metadata?.full_name || user.email}
                  bg="purple.500"
                />
                <VStack align="start" spacing={3} flex={1}>
                  <HStack justify="space-between" w="full">
                    <VStack align="start" spacing={1}>
                      <Heading size="lg" fontFamily="heading">
                        {user.user_metadata?.full_name || user.email}
                      </Heading>
                      <HStack>
                        <Badge colorScheme="purple" variant="subtle">
                          Rank #{userStats.rank}
                        </Badge>
                        <Badge colorScheme="green" variant="subtle">
                          {userStats.totalPoints} Points
                        </Badge>
                      </HStack>
                    </VStack>
                    <Button leftIcon={<FiEdit />} variant="outline" size="sm">
                      Edit Profile
                    </Button>
                  </HStack>
                  
                  <Text color="gray.400">
                    Competitive eFootball player • {userStats.tournamentsWon} Tournament Wins
                  </Text>
                  
                  <HStack spacing={8}>
                    <VStack spacing={1}>
                      <Text fontSize="lg" fontWeight="bold" color="brand.500">
                        {userStats.winRate}%
                      </Text>
                      <Text fontSize="xs" color="gray.400">Win Rate</Text>
                    </VStack>
                    <VStack spacing={1}>
                      <Text fontSize="lg" fontWeight="bold" color="green.400">
                        {userStats.currentStreak}
                      </Text>
                      <Text fontSize="xs" color="gray.400">Current Streak</Text>
                    </VStack>
                    <VStack spacing={1}>
                      <Text fontSize="lg" fontWeight="bold" color="yellow.400">
                        {userStats.bestStreak}
                      </Text>
                      <Text fontSize="xs" color="gray.400">Best Streak</Text>
                    </VStack>
                  </HStack>
                </VStack>
              </HStack>
            </CardBody>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
          <StatCard
            icon={<FiTrophy />}
            label="Matches Played"
            value={userStats.totalMatches}
            helpText={`${userStats.wins}W - ${userStats.losses}L`}
            delay={0.1}
          />
          <StatCard
            icon={<FiTarget />}
            label="Goals Scored"
            value={userStats.goalsScored}
            helpText={`${(userStats.goalsScored / userStats.totalMatches).toFixed(1)} per match`}
            color="green.400"
            delay={0.2}
          />
          <StatCard
            icon={<FiAward />}
            label="Clean Sheets"
            value={userStats.cleanSheets}
            helpText={`${Math.round((userStats.cleanSheets / userStats.totalMatches) * 100)}% of matches`}
            color="blue.400"
            delay={0.3}
          />
          <StatCard
            icon={<FiTrendingUp />}
            label="Tournaments Won"
            value={userStats.tournamentsWon}
            helpText="Championship titles"
            color="yellow.400"
            delay={0.4}
          />
        </Grid>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card bg="rgba(22, 27, 34, 0.8)" border="1px solid" borderColor="gray.700">
            <CardBody>
              <Heading size="md" mb={4} fontFamily="heading">
                Ranking Progress
              </Heading>
              <VStack spacing={4}>
                <HStack justify="space-between" w="full">
                  <Text color="gray.400">Current Rank</Text>
                  <Text fontWeight="bold">#{userStats.rank}</Text>
                </HStack>
                <Progress
                  value={75}
                  size="lg"
                  colorScheme="purple"
                  w="full"
                  borderRadius="full"
                />
                <HStack justify="space-between" w="full" fontSize="sm" color="gray.400">
                  <Text>Rank #200</Text>
                  <Text>Progress to Rank #100</Text>
                  <Text>Rank #100</Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </motion.div>

        {/* Achievements */}
        <VStack align="stretch" spacing={4}>
          <Heading size="md" fontFamily="heading">
            Achievements
          </Heading>
          <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }} gap={4}>
            {achievements.map((achievement, index) => (
              <AchievementBadge
                key={achievement.title}
                title={achievement.title}
                description={achievement.description}
                earned={achievement.earned}
                delay={index * 0.1}
              />
            ))}
          </Grid>
        </VStack>
      </VStack>
    </Container>
  )
}

export default Profile
