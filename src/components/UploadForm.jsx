import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Text,
  Image,
  Alert,
  AlertIcon,
  Progress,
  Card,
  CardBody,
  useToast,
} from '@chakra-ui/react'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiUpload, FiCheck, FiX } from 'react-icons/fi'
import axios from 'axios'

const MotionCard = motion(Card)

const UploadForm = ({ matchId, onVerificationComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [verificationResult, setVerificationResult] = useState(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)
  const toast = useToast()

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file)
        setError('')
        
        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => setPreview(e.target.result)
        reader.readAsDataURL(file)
      } else {
        setError('Please select a valid image file')
      }
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a screenshot first')
      return
    }

    setUploading(true)
    setError('')

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('screenshot', selectedFile)
      formData.append('matchId', matchId)

      // Upload to FastAPI backend
      const response = await axios.post('/api/verifyScreenshot', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          // You can use this for progress bar if needed
        },
      })

      setVerificationResult(response.data)
      
      if (response.data.verified) {
        toast({
          title: 'Screenshot Verified!',
          description: `Match result confirmed: ${response.data.winner} wins ${response.data.score}`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        onVerificationComplete?.(response.data)
      } else {
        toast({
          title: 'Verification Failed',
          description: response.data.reason || 'Could not verify the screenshot',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.')
      toast({
        title: 'Upload Error',
        description: 'Failed to upload screenshot',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setPreview(null)
    setVerificationResult(null)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <MotionCard
      bg="rgba(22, 27, 34, 0.8)"
      backdropFilter="blur(10px)"
      border="1px solid"
      borderColor="gray.700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CardBody>
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Text fontSize="lg" fontWeight="bold" fontFamily="heading" mb={2}>
              Upload Match Screenshot
            </Text>
            <Text fontSize="sm" color="gray.400">
              Upload a clear screenshot of your match result for AI verification
            </Text>
          </Box>

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          {verificationResult && (
            <Alert 
              status={verificationResult.verified ? 'success' : 'error'} 
              borderRadius="md"
            >
              <AlertIcon />
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold">
                  {verificationResult.verified ? 'Verification Successful!' : 'Verification Failed'}
                </Text>
                {verificationResult.verified && (
                  <Text fontSize="sm">
                    Winner: {verificationResult.winner} | Score: {verificationResult.score}
                  </Text>
                )}
                {verificationResult.reason && (
                  <Text fontSize="sm">{verificationResult.reason}</Text>
                )}
              </VStack>
            </Alert>
          )}

          <FormControl>
            <FormLabel>Screenshot File</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              ref={fileInputRef}
              display="none"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              borderColor="gray.600"
              _hover={{ borderColor: 'brand.500' }}
              leftIcon={<FiUpload />}
              w="full"
            >
              {selectedFile ? 'Change Screenshot' : 'Select Screenshot'}
            </Button>
          </FormControl>

          {preview && (
            <Box>
              <Text fontSize="sm" color="gray.400" mb={2}>Preview:</Text>
              <Image
                src={preview}
                alt="Screenshot preview"
                maxH="300px"
                w="full"
                objectFit="contain"
                borderRadius="md"
                border="1px solid"
                borderColor="gray.600"
              />
            </Box>
          )}

          {uploading && (
            <VStack spacing={2}>
              <Progress
                size="sm"
                isIndeterminate
                colorScheme="purple"
                w="full"
                borderRadius="full"
              />
              <Text fontSize="sm" color="gray.400">
                Uploading and verifying screenshot...
              </Text>
            </VStack>
          )}

          <HStack spacing={4}>
            <Button
              onClick={handleUpload}
              isDisabled={!selectedFile || uploading}
              isLoading={uploading}
              loadingText="Verifying..."
              variant="purple"
              flex={1}
              rightIcon={<FiCheck />}
            >
              Upload & Verify
            </Button>
            <Button
              onClick={resetForm}
              variant="outline"
              borderColor="gray.600"
              _hover={{ borderColor: 'red.500' }}
              rightIcon={<FiX />}
            >
              Reset
            </Button>
          </HStack>

          <Text fontSize="xs" color="gray.500" textAlign="center">
            Supported formats: JPG, PNG, GIF • Max size: 10MB
          </Text>
        </VStack>
      </CardBody>
    </MotionCard>
  )
}

export default UploadForm
