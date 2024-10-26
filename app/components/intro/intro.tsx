'use client';

import { Stack, Flex, Text, VStack, HStack, useBreakpointValue, IconButton, useColorModeValue, chakra, VisuallyHidden } from '@chakra-ui/react';
import { useEffect, useState, useRef, ReactNode } from 'react';
import { FaSpotify, FaYoutube, FaTiktok, FaEnvelope, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

export default function WithBackgroundVideo() {
	const [isReady, setIsReady] = useState(false);
	const [isMuted, setIsMuted] = useState(true); // State to manage mute status
	const videoRef = useRef<HTMLVideoElement | null>(null); // Specify the ref type for a video element

	// Handle component ready state
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsReady(true);
		}, 500); // Adding a slight delay for a smooth transition effect
		return () => clearTimeout(timer);
	}, []);



const SocialButton = ({
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

	// Toggle mute function
	const toggleMute = () => {
		if (videoRef.current) {
			videoRef.current.muted = !videoRef.current.muted; // Toggle the muted property
			setIsMuted(videoRef.current.muted); // Update mute state
		}
	};

	return (
		<Flex w={'100vw'} h={'100vh'} position={'relative'} overflow={'hidden'}>
			{/* Background Video */}
			<video
				ref={videoRef} // Assigning ref to the video element
				autoPlay
				loop
				muted={isMuted} // Set mute based on the state
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					zIndex: -1 // Ensure the video stays behind the content
				}}
			>
				<source src="video/jah_blessing_croped_small.mp4" type="video/mp4" />
				Your browser does not support the video tag.
			</video>

			<VStack
				w={'full'} 
				justify={'center'}
				px={useBreakpointValue({ base: 4, md: 8 })}
				bgGradient={'linear(to-r, blackAlpha.600, transparent)'}
			>
				<Stack maxW={'2xl'} align={'flex-start'} spacing={3}>
					{/* The smaller intro text with a smooth fade-in transition */}
					<Text
						color={'white'}
						fontWeight={200}
						lineHeight={1.2}
						fontSize={useBreakpointValue({ base: 'md', md: 'md' })} // Smaller size for intro text
						opacity={isReady ? 1 : 0}
						transform={isReady ? 'translateY(0)' : 'translateY(20px)'}
						transition="opacity 1.5s ease, transform 1.5s ease"
					>
						Where Reggae Meets the World:
					</Text>

					{/* Main bold text with a smooth fade-in transition */}
					<Text
						color={'white'}
						fontWeight={700}
						lineHeight={1.3}
						fontSize={useBreakpointValue({ base: '3xl', md: '3xl', lg: '4xl' })} // Larger size for the core message
						opacity={isReady ? 1 : 0}
						transform={isReady ? 'translateY(0)' : 'translateY(20px)'}
						transition="opacity 1.5s ease, transform 1.5s ease"
					>
						Bridging Cultures, Elevating Consciousness, and Inspiring Change Through Music.
					</Text>

					{/* Social Icons in horizontal row */}
					<HStack spacing={6} opacity={isReady ? 1 : 0} transform={isReady ? 'translateY(0)' : 'translateY(20px)'} transition="opacity 1.5s ease, transform 1.5s ease">
						<SocialButton label={'Mail'} href={'mailto:info@calip.ch'}>
							<FaEnvelope color='white' />
						</SocialButton>
						<SocialButton label={'Spotify'} href={'https://open.spotify.com/intl-de/artist/3ecsQBXTAjmQyO3Nqq0KZV'}>
							<FaSpotify color='white' />
						</SocialButton>
						<SocialButton label={'YouTube'} href={'https://www.youtube.com/calipmusic?sub_confirmation=1'}>
							<FaYoutube color='white' />
						</SocialButton>
						<SocialButton label={'TikTok'} href={'https://www.tiktok.com/@itscalip'}>
							<FaTiktok color='white'/>
						</SocialButton>
					</HStack>
				</Stack>
			</VStack>

			{/* Mute/Unmute Button */}
			<IconButton
				aria-label="Toggle sound"
				icon={isMuted ? <FaVolumeMute color='white' /> : <FaVolumeUp color='white' />}
				position="absolute"
				bottom="20px" // Adjust bottom position as needed
				right="20px" // Adjust right position as needed
				bg="blackAlpha.700"
				color="white"
				_hover={{ bg: "blackAlpha.800" }}
				onClick={toggleMute}
				size="lg"
				zIndex={1} // Ensure the button is above other elements
			/>
		</Flex>
	);
}
