import { Container, Grid, GridItem, Heading } from "@chakra-ui/react";

export default function Header() {
    return(
        <Container maxW='100%'  w='100%' p={4}>
            <Container maxW='100%'  w='100%' p={0}>
            <Grid templateColumns='repeat(2, 1fr)' gap={6}>
            <GridItem w='100%'> 
            <Heading as='h3' size='lg'>
                Cali P
            </Heading>
            </GridItem>
            <GridItem w='100%'> &nbsp; </GridItem>
            </Grid>
            </Container>
        </Container>
    )
}