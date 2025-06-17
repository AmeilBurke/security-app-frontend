import { Container } from "@chakra-ui/react"
import { Outlet } from "react-router"


const ComponentContainer = ({ children }: { children?: JSX.Element | JSX.Element[] }) => {
    return (
        <Container minH="100vh" maxW='breakpoint-2xl' mx='auto' pb={8} px={4}>
            {children}
            <Outlet />
        </Container>
    )
}

export default ComponentContainer