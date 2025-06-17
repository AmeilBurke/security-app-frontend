import { getAllNonPendingBan } from "@/api-requests/banned-people/getAllNonPendingBan"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import ComponentContainer from "@/components/container/ComponentContainer"
import { setNavbarHeadingState } from "@/features/navbarHeadingSlice"
import { capitalizeString, displayErrorToastForAxios } from "@/utils/helper-functions"
import { AlertDetail, BannedPersonWithActiveAlerts, isPrismaResultError, PrismaResultError } from "@/utils/types"
import { Button, Center, Heading, Image, Separator, Spinner, VStack, Text, SimpleGrid, HStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Link as RouterLink, useLoaderData } from "react-router"
import { Link as ChakraLink } from "@chakra-ui/react"

const PageDashboard = () => {
  const allActiveAlerts = useLoaderData<AlertDetail[] | PrismaResultError>();

  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true)
  const stateBannedPeople = useAppSelector(state => state.bannedPeopleDetailsSlice)

  useEffect(() => {
    if (isInitialLoad) {
      setNavbarHeadingState('Dashboard')
      setIsInitialLoad(false)
    }
  }, [isInitialLoad])


  if (isInitialLoad || stateBannedPeople.isLoading) {
    return <Center><Spinner /></Center>
  }


  return (
    <ComponentContainer>
      <VStack w="full" gap={8} >
        <ChakraLink w="full" asChild>
          <RouterLink to="create-alert">
            <Button w="full">Create Alert</Button>
          </RouterLink>
        </ChakraLink>

        <ChakraLink w="full" asChild>
          <RouterLink to="create-ban">
            <Button w="full">Create Ban</Button>
          </RouterLink>
        </ChakraLink>

        <Separator w="full" />

        {
          isPrismaResultError(allActiveAlerts) || allActiveAlerts.length === 0
            ? null
            : <>
              <Heading>Active Alerts</Heading>
              <SimpleGrid columns={{ base: 2, lg: 4 }} gap={8} >
                {allActiveAlerts.map((alert) => {
                  return <ChakraLink h="100%" w="full" asChild key={alert.alertDetail_id} >
                    <RouterLink to={`active-alert/${alert.alertDetail_id}`}>
                      <VStack h="100%" align="flex-start" gap={2} >
                        <Image h="20vh" aspectRatio={1} objectFit='cover' src={alert.alertDetail_imagePath} />
                        <VStack alignItems='flex-start' gap={0} >
                          <Text>{capitalizeString(alert.alertDetail_name)}</Text>
                          <Text fontSize='small' color="gray.500" >{capitalizeString(alert.alertDetail_alertReason)}</Text>
                        </VStack>
                      </VStack>
                    </RouterLink>
                  </ChakraLink>
                })}
              </SimpleGrid>
            </>
        }

      </VStack>
    </ComponentContainer>
  )
}

export default PageDashboard