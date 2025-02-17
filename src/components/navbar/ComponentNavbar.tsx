import { Button, Center, Heading, HStack, MenuOpenChangeDetails, VStack, Text, Separator, Link as ChakraLink } from '@chakra-ui/react'
import { GoSun, GoMoon, GoSignOut, GoListUnordered } from 'react-icons/go'
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
import { Account } from '@/utils/types/indexTypes'
import { setUserAccountDetails } from '@/features/userAccountDetails/userAccountDetailsSlice'
import { Link, Route } from "react-router";



const ComponentNavbar = () => {
  const { toggleColorMode } = useColorMode()
  const [open, setOpen] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const userAccountDetails = useAppSelector(state => state.userAccountDetailsSlice)

  const signOutHandler = () => {
    localStorage.removeItem('jwt')
    const accountDefaults: Account = {
      account_id: -1,
      account_email: "",
      account_name: "",
      account_roleId: -1,
      role_name: {
        role_id: -1,
        role_name: ""
      }
    }
    dispatch(setUserAccountDetails(accountDefaults))
    window.location.reload()
  }

  return (

    <DrawerRoot size={['xs']} open={open} onOpenChange={(element: MenuOpenChangeDetails) => setOpen(element.open)}>
      <DrawerBackdrop />
      <DrawerTrigger asChild>
        <Button variant="plain">
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
          <ChakraLink asChild w="full" pl={[0]} justifyContent={['start']} fontSize={['md']} _hover={{textDecoration: 'none'}}>
            <Link to='/' onClick={() => setOpen(false)} ><Button variant="ghost" w="full" pl={[0]} justifyContent={['start']} fontSize={['md']}>Dashboard</Button></Link>
          </ChakraLink>
          <ChakraLink asChild w="full" pl={[0]} justifyContent={['start']} fontSize={['md']} _hover={{textDecoration: 'none'}}>
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