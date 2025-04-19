import { Container } from "@chakra-ui/react"


const ComponentContainer = ({ children }: { children?: JSX.Element }) => {
    return (
        <Container h="100%" maxW='breakpoint-2xl' mx='auto' pb={8} px={4} >
            {children}
        </Container>
    )
}

export default ComponentContainer