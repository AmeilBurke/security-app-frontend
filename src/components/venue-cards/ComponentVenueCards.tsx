import { useAppSelector } from "@/app/hooks"
import { Venue } from "@/utils/types/indexTypes"
import { Heading, VStack } from "@chakra-ui/react"
import ComponentCenteredSpinner from "../centered-spinner/ComponentCenteredSpinner"

const ComponentVenueCards = () => {
    const allVenuesState = useAppSelector(state => {
        return state.venuesSlice
    })

    if (allVenuesState.data.all_venues === null) {
        return <ComponentCenteredSpinner />
    } else {
        return (
            <VStack>
                <Heading>Venues</Heading>
                {allVenuesState.data.all_venues.map((venue: Venue) => {
                    return <Heading key={venue.venue_id} >{venue.venue_name}</Heading>
                })}
            </VStack>
        )
    }
}

export default ComponentVenueCards
