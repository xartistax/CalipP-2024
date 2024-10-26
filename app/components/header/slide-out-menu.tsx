import { Box } from "@chakra-ui/react";


interface SlideOutMenu  {
    isOpen : Boolean
}

export default function SlideOutMenu({ isOpen } : SlideOutMenu) {
    return (
        <>
            <Box
                height="100vh"
                zIndex={100} 
                padding={10}
                backgroundColor="red"
                position="fixed"
                top={0}
                right={0}
                width="300px"
                transform={isOpen ? "translateX(0)" : "translateX(100%)"}  
                transition="transform 0.3s ease-in-out" 
            >
                Slide Out Menu
            </Box>
        </>
    );
}
