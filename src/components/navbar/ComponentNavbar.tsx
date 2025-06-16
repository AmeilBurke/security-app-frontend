import {
  Button,
  Center,
  Heading,
  MenuOpenChangeDetails,
  VStack,
  Text,
  Separator,
  Link as ChakraLink,
  HStack,
  Box,
} from "@chakra-ui/react"
import { GoSignOut, GoListUnordered } from "react-icons/go"
import { useColorMode, useColorModeValue } from "../ui/color-mode"
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { Link, useNavigate } from "react-router"
import ComponentContainer from "../container/ComponentContainer"
import { resetUserAccountState } from "@/features/userAccountDetailsSlice"
import { clearJwt } from "@/api-requests/authentication/clearJwt"

const ComponentNavbar = () => {
  const { toggleColorMode } = useColorMode()
  const [open, setOpen] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const userAccountState = useAppSelector(state => state.userAccountDetailsSlice)
  const navbarHeadingState = useAppSelector(state => state.navbarHeadingSlice)
  const navigate = useNavigate()

  const signOutHandler = async () => {
    dispatch(resetUserAccountState())
    await clearJwt()
    navigate("/sign-in")
  }

  return (
    <DrawerRoot
      size={["xs"]}
      open={open}
      placement='start'
      onOpenChange={(element: MenuOpenChangeDetails) => setOpen(element.open)}
    >
      <DrawerBackdrop />

      <VStack>
        <Center position="relative" w="full" h="full" py={4}>
          <DrawerTrigger position='absolute' top={4} left={0} asChild >
            <Button p={0} variant='ghost'>
              <GoListUnordered />
            </Button>
          </DrawerTrigger>
          <Heading textAlign='center'>{navbarHeadingState.heading}</Heading>
        </Center>
        <Separator w="full" mb={8} />
      </VStack>

      <DrawerContent>
        <DrawerCloseTrigger />
        <DrawerHeader>
          <DrawerTitle>
            <VStack>
              <Heading w="full" textTransform={["capitalize"]}>
                {userAccountState.data?.account_name}
              </Heading>
              <Text
                w="full"
                textStyle={["md"]}
                color={["gray.500"]}
                textTransform={["capitalize"]}
              >
                {userAccountState.data?.Role.role_name}
              </Text>
            </VStack>
          </DrawerTitle>
        </DrawerHeader>
        <DrawerBody spaceY={["10"]}>
          <Separator />
          <Button
            onClick={toggleColorMode}
            variant="ghost"
            w="full"
            pl={[0]}
            justifyContent={["start"]}
            fontSize={["md"]}
          >
            Theme: {useColorModeValue(<Text>Light</Text>, <Text>Dark</Text>)}
          </Button>
          <ChakraLink
            asChild
            w="full"
            pl={[0]}
            justifyContent={["start"]}
            fontSize={["md"]}
            _hover={{ textDecoration: "none" }}
          >
            <Link to="/" onClick={() => setOpen(false)}>
              <Button
                variant="ghost"
                w="full"
                pl={[0]}
                justifyContent={["start"]}
                fontSize={["md"]}
              >
                Dashboard
              </Button>
            </Link>
          </ChakraLink>
          <ChakraLink
            asChild
            w="full"
            pl={[0]}
            justifyContent={["start"]}
            fontSize={["md"]}
            _hover={{ textDecoration: "none" }}
          >
            <Link to="/account-settings" onClick={() => setOpen(false)}>
              <Button
                variant="ghost"
                w="full"
                pl={[0]}
                justifyContent={["start"]}
                fontSize={["md"]}
              >
                Settings
              </Button>
            </Link>
          </ChakraLink>
        </DrawerBody>
        <DrawerFooter>
          <Center w="full" pl={[0]} justifyContent={["start"]}>
            <Button variant="plain" onClick={signOutHandler}>
              Sign out <GoSignOut />{" "}
            </Button>
          </Center>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  )
}

export default ComponentNavbar
