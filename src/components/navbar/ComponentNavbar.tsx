import { Button, Center, Heading, MenuOpenChangeDetails, VStack, Text, Separator, Link as ChakraLink } from '@chakra-ui/react'
import { GoSignOut, GoListUnordered } from 'react-icons/go'
import { useColorMode, useColorModeValue } from '../ui/color-mode'
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
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Link, useNavigate } from "react-router";
import { resetALertDetailsState } from '@/features/alertDetails/alertDetailsSlice'
import { resetBannedPeopleState } from '@/features/bannedPeople/bannedPeopleSlice'
import { resetOtherAccountDetailsState } from '@/features/otherAccountDetails/otherAccountDetailsSlice'
import { resetUserAccountDetailsState } from '@/features/userAccountDetails/userAccountDetailsSlice'
import { resetVenuesState } from '@/features/venues/venuesSlice'



const ComponentNavbar = () => {
  const { toggleColorMode } = useColorMode()
  const [open, setOpen] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const userAccountDetails = useAppSelector(state => state.userAccountDetailsSlice)
  const navigate = useNavigate()

  const signOutHandler = () => {
    localStorage.removeItem('jwt')

    dispatch(resetALertDetailsState())
    dispatch(resetBannedPeopleState())
    dispatch(resetOtherAccountDetailsState())
    dispatch(resetUserAccountDetailsState())
    dispatch(resetVenuesState())

    navigate('/')
    // window.location.reload()
  }

  return (

    <DrawerRoot size={['xs']} open={open} onOpenChange={(element: MenuOpenChangeDetails) => setOpen(element.open)}>
      <DrawerBackdrop />
      <DrawerTrigger asChild>
        <Button marginTop={[4]} variant="plain">
          <GoListUnordered />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerCloseTrigger />
        <DrawerHeader>
          <DrawerTitle>
            <VStack>
              <Heading w="full" textTransform={['capitalize']} >{userAccountDetails.account_name}</Heading>
              <Text w="full" textStyle={['md']} color={['gray.500']} textTransform={['capitalize']}>{userAccountDetails.role_name.role_name}</Text>
            </VStack>
          </DrawerTitle>
        </DrawerHeader>
        <DrawerBody spaceY={['10']}>
          <Separator />
          <Button onClick={toggleColorMode} variant="ghost" w="full" pl={[0]} justifyContent={['start']} fontSize={['md']}>Theme: {useColorModeValue(<Text>Light</Text>, <Text>Dark</Text>)}</Button>
          <ChakraLink asChild w="full" pl={[0]} justifyContent={['start']} fontSize={['md']} _hover={{ textDecoration: 'none' }}>
            <Link to='/' onClick={() => setOpen(false)} ><Button variant="ghost" w="full" pl={[0]} justifyContent={['start']} fontSize={['md']}>Dashboard</Button></Link>
          </ChakraLink>
          <ChakraLink asChild w="full" pl={[0]} justifyContent={['start']} fontSize={['md']} _hover={{ textDecoration: 'none' }}>
            <Link to='/account-settings' onClick={() => setOpen(false)} ><Button variant="ghost" w="full" pl={[0]} justifyContent={['start']} fontSize={['md']}>Settings</Button></Link>
          </ChakraLink>
        </DrawerBody>
        <DrawerFooter>
          <Center w="full" pl={[0]} justifyContent={['start']}><Button variant="plain" onClick={signOutHandler}>Sign out <GoSignOut /> </Button></Center>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  )
}

export default ComponentNavbar