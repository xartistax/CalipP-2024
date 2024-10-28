'use client';

import {
    Stack,
    Flex,
    Text,
    VStack,
    HStack,
    useBreakpointValue,
    IconButton,
    useColorModeValue,
    chakra,
    VisuallyHidden,
    Box,
} from '@chakra-ui/react';
import { useEffect, useState, useRef, ReactNode } from 'react';
import { FaSpotify, FaYoutube, FaTiktok, FaEnvelope, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import Image from 'next/image';

export default function WithBackgroundVideo() {
    const [isReady, setIsReady] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const videoSrc = useBreakpointValue({
        base: '/video/jah_blessing_mobile.mp4',
        md: '/video/jah_blessing_croped_small.mp4',
    });

    const posterSrc = useBreakpointValue({
        base: '/video/poster_mobile.jpg',
        md: '/video/poster_screen.jpg',
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsReady(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const SocialButton = ({
        children,
        label,
        href,
    }: {
        children: ReactNode;
        label: string;
        href: string;
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
        );
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    return (
        <Flex w="100vw" h="100vh" position="relative" overflow="hidden">
            <Flex
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100%"
                zIndex={-1}
                bg="black"
                justifyContent="center"
                alignItems="center"
                overflow="hidden"
                style={{ aspectRatio: "16 / 9" }}
            >
                <video
                    ref={videoRef}
                    autoPlay
                    poster={posterSrc}
                    loop
                    muted={isMuted}
                    playsInline
                    key={`${videoSrc}-${posterSrc}`}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        position: "absolute",
                        opacity: isReady ? 1 : 0,
                        transition: "opacity 0.5s ease-in-out",
                    }}
                >
                    <source src={videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </Flex>

            {/* Centered content stack */}
            <VStack
                w="full"
                h="full"
                justify="center"
                align="center"
                spacing={6}
                bgGradient="linear(to-r, blackAlpha.600, transparent)"
            >
                <Stack maxW="2xl" align="center" spacing={3}>
                    {/* Centered Logo Image */}
                    <Box opacity={isReady ? 1 : 0}
                         transform={isReady ? 'translateY(0)' : 'translateY(20px)'}
                         transition="opacity 1.5s ease, transform 1.5s ease">
                        <Image src={'/logo.png'} width={300} height={100} alt="Logo" />
                    </Box>

                    {/* Main Text */}
                    <Text
					padding={5}
                        color="white"
                        fontWeight={100}
                        lineHeight={1.3}
                        textAlign="center"
                        fontSize={useBreakpointValue({ base: 'base', md: 'base', lg: 'base' })}
                        opacity={isReady ? 1 : 0}
                        transform={isReady ? 'translateY(0)' : 'translateY(20px)'}
                        transition="opacity 1.5s ease, transform 1.5s ease"
                    >
                        Bridging Cultures, Elevating Consciousness, and Inspiring Change Through Music.
                    </Text>

                    {/* Social Icons */}
                    <HStack
					paddingTop={3}
                        spacing={6}
                        opacity={isReady ? 1 : 0}
                        transform={isReady ? 'translateY(0)' : 'translateY(20px)'}
                        transition="opacity 1.5s ease, transform 1.5s ease"
                    >
                        <SocialButton label="Mail" href="mailto:info@calipmusig.com">
                            <FaEnvelope color="white" />
                        </SocialButton>
                        <SocialButton label="Spotify" href="https://open.spotify.com/intl-de/artist/3ecsQBXTAjmQyO3Nqq0KZV">
                            <FaSpotify color="white" />
                        </SocialButton>
                        <SocialButton label="YouTube" href="https://www.youtube.com/calipmusic?sub_confirmation=1">
                            <FaYoutube color="white" />
                        </SocialButton>
                        <SocialButton label="TikTok" href="https://www.tiktok.com/@itscalip">
                            <FaTiktok color="white" />
                        </SocialButton>
                    </HStack>
                </Stack>
            </VStack>

            {/* Mute/Unmute Button */}
            <IconButton
                aria-label="Toggle sound"
                icon={isMuted ? <FaVolumeMute color="white" /> : <FaVolumeUp color="white" />}
                position="absolute"
                bottom="20px"
                right="20px"
                bg="blackAlpha.700"
                color="white"
                _hover={{ bg: "blackAlpha.800" }}
                onClick={toggleMute}
                size="lg"
                zIndex={1}
            />
        </Flex>
    );
}
