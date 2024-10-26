'use client'

import { ReactNode } from 'react'
import {
  Box,
  Container,
  Stack,
  Text,
  VisuallyHidden,
  chakra, 
  useColorModeValue,
} from '@chakra-ui/react'
import { FaSpotify, FaYoutube, FaTiktok } from 'react-icons/fa'

// import { AppStoreBadge } from '#/components/AppStoreBadge'
// import { PlayStoreBadge } from '#/components/PlayStoreBadge'

export const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode
  label: string
  href: string
}) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}>
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  )
}

export default function LargeWithAppLinksAndSocial() {
  return (
    <Box
    position={'absolute'}
    bottom={0}
    left={0}
    width={'100vw'}
    zIndex={100}
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}>


      <Box
        borderTopWidth={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.700')}>
        <Container
          as={Stack}
          maxW={'6xl'}
          py={4}
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify={{ md: 'space-between' }}
          align={{ md: 'center' }}>
          <Text>© 2024 CaliP Music. All rights reserved</Text>
          <Stack direction={'row'} spacing={6}>
            <SocialButton label={'Spotify'} href={'#'}>
              <FaSpotify />
            </SocialButton>
            <SocialButton label={'YouTube'} href={'#'}>
              <FaYoutube />
            </SocialButton>
            <SocialButton label={'TikTok'} href={'#'}>
              <FaTiktok />
            </SocialButton>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}