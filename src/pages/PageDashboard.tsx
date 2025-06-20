import { useAppSelector } from "@/app/hooks"
import ComponentContainer from "@/components/container/ComponentContainer"
import { setNavbarHeadingState } from "@/features/navbarHeadingSlice"
import { capitalizeString } from "@/utils/helper-functions"
import { AlertDetail, isPrismaResultError, PrismaResultError, Venue } from "@/utils/types"
import { Button, Center, Heading, Image, Separator, Spinner, VStack, Text, SimpleGrid, HStack, Box, Avatar, Input, Link as ChakraLink } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Link as RouterLink, useLoaderData } from "react-router"


const PageDashboard = () => {
  const apiRequests = useLoaderData<{ alertDetails: AlertDetail[], venues: Venue[] } | PrismaResultError>();

  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true)
  const [inputVenueSearch, setInputVenueSearch] = useState<string>("")
  const [venuesFiltered, setVenuesFiltered] = useState<Venue[]>([])
  const stateBannedPeople = useAppSelector(state => state.bannedPeopleDetailsSlice)

  useEffect(() => {
    if (isInitialLoad) {
      setNavbarHeadingState('Dashboard')
      setIsInitialLoad(false)
    }

    if (!isPrismaResultError(apiRequests)) {
      setVenuesFiltered(apiRequests.venues)
    }

  }, [isInitialLoad])


  if (isInitialLoad || stateBannedPeople.isLoading) {
    return <Center><Spinner /></Center>
  }

  if (isPrismaResultError(apiRequests)) {
    return <Text>Error Fetching Data. Refresh The Page & Try Again.</Text>
  }

  const inputVenueSearchHandler = (inputText: string) => {
    inputText = inputText.toLocaleLowerCase()
    setInputVenueSearch(inputText)

    if (apiRequests.venues.length === 0) {
      return null
    }

    if (inputText === "") {
      setVenuesFiltered(apiRequests.venues)
      return
    }

    const filteredSearchResult = apiRequests.venues.filter((venue) => {
      if (venue.venue_name.toLocaleLowerCase().includes(inputText)) {
        return venue
      }
    })
    setVenuesFiltered(filteredSearchResult)
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

        {apiRequests.alertDetails.length === 0
          ? null
          : <>
            <Heading>Active Alerts</Heading>
            <SimpleGrid columns={{ base: 2, lg: 4 }} gap={8} >
              {apiRequests.alertDetails.map((alert) => {
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


        {apiRequests.venues.length === 0
          ? null
          : <>
            <Heading>Venues</Heading>
            <Input placeholder="Search Venues" value={inputVenueSearch} onChange={(event) => inputVenueSearchHandler(event.target.value)} />

            {
              venuesFiltered.map(venue => {
                return <ChakraLink asChild w="full" variant='underline' key={venue.venue_id} >
                  <RouterLink to={`venue/${venue.venue_id}`}>
                    <HStack w="full">
                      <Avatar.Root size="2xl" shape="square" variant='outline' >
                        <Avatar.Fallback name={venue.venue_name} />
                        <Avatar.Image objectFit='contain' p={1} src={venue.venue_imagePath} />
                      </Avatar.Root>
                      <Text w="full" textAlign='start' key={venue.venue_id} >{capitalizeString(venue.venue_name)}</Text>
                    </HStack>
                  </RouterLink>
                </ChakraLink>
              })
            }
          </>
        }

      </VStack>
    </ComponentContainer>
  )
}

export default PageDashboard