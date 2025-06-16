import { getAllNonPendingBan } from "@/api-requests/banned-people/getAllNonPendingBan"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import ComponentContainer from "@/components/container/ComponentContainer"
import { setNavbarHeadingState } from "@/features/navbarHeadingSlice"
import { capitalizeString, displayErrorToastForAxios } from "@/utils/helper-functions"
import { BannedPersonWithActiveAlerts, isPrismaResultError } from "@/utils/types"
import { Button, Center, Heading, Image, Separator, Spinner, VStack, Text, SimpleGrid, HStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Link as RouterLink } from "react-router"
import { Link as ChakraLink } from "@chakra-ui/react"
import { getAllWithActiveAlerts } from "@/api-requests/banned-people/getAllWithActiveAlerts"

const PageDashboard = () => {
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true)
  const [activeAlerts, setActiveAlerts] = useState<BannedPersonWithActiveAlerts[]>([])
  const stateBannedPeople = useAppSelector(state => state.bannedPeopleDetailsSlice)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const getBannedPeopleHandler = async () => {
      const result = await getAllNonPendingBan()

      if (isPrismaResultError(result)) {
        displayErrorToastForAxios(result)
      }

      dispatch(setBannedPeopleState(result))
    }
    const getActiveAlerts = async () => {
      const result = await getAllWithActiveAlerts()

      if (isPrismaResultError(result)) {
        displayErrorToastForAxios(result)
        return
      }
      setActiveAlerts(result)
    }

    if (isInitialLoad) {
      dispatch(setNavbarHeadingState("Dashboard"))
      getBannedPeopleHandler()
      getActiveAlerts()
      setIsInitialLoad(false)
    }
  }, [isInitialLoad])

  if (isInitialLoad || stateBannedPeople.data === null || stateBannedPeople.isLoading) {
    return <Center><Spinner /></Center>
  }


  return (
    <ComponentContainer>
      <VStack w="full" gap={8} >
        {/* <ChakraLink w="full" asChild>
          <RouterLink to="create-alert">
            <Button w="full">Create Alert</Button>
          </RouterLink>
        </ChakraLink> */}

        <ChakraLink w="full" asChild>
          <RouterLink to="create-ban">
            <Button w="full">Create Ban</Button>
          </RouterLink>
        </ChakraLink>

        <Separator w="full" />

        {
          activeAlerts.length === 0
            ? null
            : <>
              <Heading>Active Alerts</Heading>
              <SimpleGrid columns={[2, 4]} gap={8} >
                {activeAlerts.map((bannedPerson) => {
                  return <VStack key={bannedPerson.bannedPerson_id} align="flex-start" gap={2} >
                    <Image h="20vh" aspectRatio={1} objectFit='cover' src={bannedPerson.bannedPerson_imagePath} />
                    <VStack alignItems='flex-start' gap={0} >
                      <Text>{capitalizeString(bannedPerson.bannedPerson_name)}</Text>
                      <Text fontSize='small' color="gray.500" >{capitalizeString(bannedPerson.AlertDetail[0].alertDetails_alertReason)}</Text>
                    </VStack>
                  </VStack>
                })}
              </SimpleGrid>
            </>
        }

      </VStack>
    </ComponentContainer>
  )
}

export default PageDashboard