import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  fonts: {
    heading: "'Orbitron', sans-serif",
    body: "'Exo 2', sans-serif",
  },
  colors: {
    brand: {
      50: '#E6FFFA',
      100: '#B2F5EA',
      200: '#81E6D9',
      300: '#4FD1C7',
      400: '#38B2AC',
      500: '#00FFFF', // Neon cyan
      600: '#00E6E6',
      700: '#00CCCC',
      800: '#00B3B3',
      900: '#009999',
    },
    purple: {
      50: '#FAF5FF',
      100: '#E9D8FD',
      200: '#D6BCFA',
      300: '#B794F6',
      400: '#9F7AEA',
      500: '#8B5CF6', // Main purple
      600: '#805AD5',
      700: '#6B46C1',
      800: '#553C9A',
      900: '#44337A',
    },
    gray: {
      50: '#F7FAFC',
      100: '#EDF2F7',
      200: '#E2E8F0',
      300: '#CBD5E0',
      400: '#A0AEC0',
      500: '#718096',
      600: '#4A5568',
      700: '#2D3748',
      800: '#1A202C',
      900: '#0D1117', // Main background
    }
  },
  styles: {
    global: {
      body: {
        bg: 'gray.900',
        color: 'white',
      },
    },
  },
  components: {
    Button: {
      variants: {
        neon: {
          bg: 'transparent',
          border: '2px solid',
          borderColor: 'brand.500',
          color: 'brand.500',
          _hover: {
            bg: 'brand.500',
            color: 'gray.900',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
            transform: 'scale(1.05)',
          },
          transition: 'all 0.3s ease',
        },
        purple: {
          bg: 'purple.500',
          color: 'white',
          _hover: {
            bg: 'purple.600',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
            transform: 'scale(1.05)',
          },
          transition: 'all 0.3s ease',
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'rgba(22, 27, 34, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(48, 54, 61, 0.5)',
          borderRadius: '16px',
        },
      },
    },
  },
})
