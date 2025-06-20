import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setNavbarHeadingState } from '@/features/navbarHeadingSlice'
import { capitalizeString } from '@/utils/helper-functions'
import { BannedPersonWithBanDetails, isPrismaResultError, PrismaResultError } from '@/utils/types'
import { SetStateAction, useEffect, useState } from 'react'
import { Box, Heading, SimpleGrid, Text, VStack, Link as ChakraLink, Image, Separator, Input } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { Link as RouterLink, useLoaderData } from "react-router"

const PageVenue = () => {
  const dispatch = useAppDispatch()
  const venueDetails = useLoaderData<{ peopleBannedFromVenue: BannedPersonWithBanDetails[] | PrismaResultError, venueId: number }>()
  const stateVenues = useAppSelector(state => state.venuesSlice.data)
  const activeVenue = stateVenues?.find(venue => venue.venue_id === venueDetails.venueId)

  const [inputActiveBanSearch, setInputActiveBanSearch] = useState<string>("")
  const [peopleWithActiveBans, setPeopleWithActiveBans] = useState<BannedPersonWithBanDetails[]>([])
  const [peopleWithActiveBansFiltered, setPeopleWithActiveBansFiltered] = useState<BannedPersonWithBanDetails[]>([])
  const [peopleWithExpiredBans, setPeopleWithExpiredBans] = useState<BannedPersonWithBanDetails[]>([])
  const [peopleWithExpiredBansFiltered, setPeopleWithExpiredBansFiltered] = useState<BannedPersonWithBanDetails[]>([])
  const [inputExpiredBanSearch, setInputExpiredBanSearch] = useState<string>("")

  useEffect(() => {
    if (activeVenue) {
      dispatch(setNavbarHeadingState(capitalizeString(activeVenue.venue_name)))
    }

    if (!isPrismaResultError(venueDetails.peopleBannedFromVenue)) {
      console.log('first')
      let active: SetStateAction<BannedPersonWithBanDetails[]> = []
      let expired: SetStateAction<BannedPersonWithBanDetails[]> = []

      venueDetails.peopleBannedFromVenue.map((person) => {
        console.log(person)
        const now = dayjs().toISOString()

        const hasAnActiveBan = person.BanDetail.some((banDetail) => {
          if (dayjs(banDetail.banDetail_banEndDate) > dayjs(now) && banDetail.banDetail_venueBanId === venueDetails.venueId) {
            return banDetail
          }
        })

        if (hasAnActiveBan) {
          active.push(person)
        } else {
          expired.push(person)
        }

      })
      setPeopleWithActiveBans(active)
      setPeopleWithExpiredBans(expired)

      setPeopleWithActiveBansFiltered(active)
      setPeopleWithExpiredBansFiltered(expired)
    }

  }, [activeVenue, venueDetails.peopleBannedFromVenue])

  if (isPrismaResultError(venueDetails.peopleBannedFromVenue)) {
    return <Text>Error Fetching Data. Refresh The Page & Try Again.</Text>
  }

  if (peopleWithActiveBans.length === 0) {
    return <Text textAlign='center'>No bans have been added to this venue yet.</Text>
  }

  const activeBanSearchHandler = (inputText: string) => {
    inputText = inputText.toLocaleLowerCase()
    setInputActiveBanSearch(inputText)

    if (peopleWithActiveBans.length === 0) {
      return null
    }

    if (inputText === "") {
      setPeopleWithActiveBansFiltered(peopleWithActiveBans)
      return
    }

    const filteredSearchResult = peopleWithActiveBans.filter((person) => {
      if (person.bannedPerson_name.toLocaleLowerCase().includes(inputText)) {
        return person
      }
    })
    setPeopleWithActiveBansFiltered(filteredSearchResult)
  }

    const expiredBanSearchHandler = (inputText: string) => {
    inputText = inputText.toLocaleLowerCase()
    setInputExpiredBanSearch(inputText)

    if (peopleWithExpiredBans.length === 0) {
      return null
    }

    if (inputText === "") {
      setPeopleWithExpiredBansFiltered(peopleWithExpiredBans)
      return
    }

    const filteredSearchResult = peopleWithExpiredBans.filter((person) => {
      if (person.bannedPerson_name.toLocaleLowerCase().includes(inputText)) {
        return person
      }
    })
    setPeopleWithExpiredBansFiltered(filteredSearchResult)
  }

  return (
    <VStack w="full" gap={24}>
      <VStack w="full" gap={12} >
        <Heading>Active Bans</Heading>
        <Input placeholder='Search Active Bans' value={inputActiveBanSearch} onChange={(event) => activeBanSearchHandler(event.target.value)} />
        <SimpleGrid columns={{ base: 2, lg: 4 }} gap={8}>
          {
            peopleWithActiveBansFiltered.map((person) => {
              return <>
                <ChakraLink h="100%" w="full" asChild key={person.bannedPerson_id} >
                  <RouterLink to={`/banned-person/${person.bannedPerson_id}`}>
                    <VStack h="100%" align="flex-start" gap={2} >
                      <Image h="20vh" aspectRatio={1} objectFit='cover' src={person.bannedPerson_imagePath} />
                      <VStack alignItems='flex-start' gap={0} >
                        <Text>{capitalizeString(person.bannedPerson_name)}</Text>
                        <Text fontSize='small' color="gray.500" >{capitalizeString(person.BanDetail[0].banDetail_reason)}</Text>
                      </VStack>
                    </VStack>
                  </RouterLink>
                </ChakraLink>
              </>
            })
          }
        </SimpleGrid>
      </VStack>

      {
        peopleWithExpiredBans.length === 0
          ? null
          : <VStack w="full" gap={8}>
            <Separator w="full" />
            <Heading>Expired Bans</Heading>
            <Input placeholder='Search Expired Bans' value={inputExpiredBanSearch} onChange={(event) => expiredBanSearchHandler(event.target.value)} />
            <SimpleGrid columns={{ base: 2, lg: 4 }} gap={8} >

              {
                peopleWithExpiredBansFiltered.map(person => {
                  return <Box key={person.bannedPerson_id} >
                    <ChakraLink h="100%" w="full" asChild opacity={0.7} >
                      <RouterLink to={`/banned-person/${person.bannedPerson_id}`}>
                        <VStack h="100%" align="flex-start" gap={2} >
                          <Image h="20vh" aspectRatio={1} objectFit='cover' src={person.bannedPerson_imagePath} />
                          <VStack alignItems='flex-start' gap={0} >
                            <Text>{capitalizeString(person.bannedPerson_name)}</Text>
                            <Text fontSize='small' color="gray.500" >{capitalizeString(person.BanDetail[0].banDetail_reason)}</Text>
                          </VStack>
                        </VStack>
                      </RouterLink>
                    </ChakraLink>
                  </Box>
                })
              }
            </SimpleGrid>
          </VStack>
      }

    </VStack>
  )
}

export default PageVenue