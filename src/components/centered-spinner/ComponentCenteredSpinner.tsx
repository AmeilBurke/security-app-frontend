import { Center, Spinner } from "@chakra-ui/react"

const ComponentCenteredSpinner = () => {
    return (
        <Center position="absolute" top="0" left="0" h="100vh" w="100vw">
            <Spinner />
        </Center>
    )
}

export default ComponentCenteredSpinner