import { useAppSelector } from "@/app/hooks"
import { Venue } from "@/utils/types/indexTypes"
import { Heading, VStack, Image, SimpleGrid } from "@chakra-ui/react"
import ComponentCenteredSpinner from "../centered-spinner/ComponentCenteredSpinner"
import { utilGetFileTypeFromBase64String } from "@/utils/functions/utilGetFileTypeFromBase64String"
import { Link as ReactRouterLink } from "react-router"

const ComponentVenueCards = () => {
  const allVenuesState = useAppSelector(state => {
    return state.venuesSlice
  })

  if (allVenuesState.data.all_venues === null) {
    return <ComponentCenteredSpinner />
  } else {
    return (
      <VStack w="full" gap={8} alignItems="center">
        <Heading w="full">Venues</Heading>
        <SimpleGrid gap={8} columns={[2, null, 4]}>
          {allVenuesState.data.all_venues.map((venue: Venue) => {
            const imageType = utilGetFileTypeFromBase64String(
              venue.venue_imagePath,
            )

            return (
              <ReactRouterLink
                to={`venue/${venue.venue_id}`}
                key={venue.venue_id}
              >
                <Image
                  height="30vh"
                  p={8}
                  fit="scale-down"
                  aspectRatio={1}
                  bgColor="#FDFDFD"
                  border="xs"
                  borderColor={"lightgray"}
                  shadow="sm"
                  src={`data:${imageType};base64,${venue.venue_imagePath}`}
                />
                <Heading textTransform="capitalize">{venue.venue_name}</Heading>
              </ReactRouterLink>
            )
          })}
        </SimpleGrid>
      </VStack>
    )
  }
}

export default ComponentVenueCards
