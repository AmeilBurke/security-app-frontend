import { getAllVenues } from "@/api-requests/venues/getAllVenues"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { getVenues, setVenues } from "@/features/venues/venuesSlice"
import { getFileExtensionFromBase64String } from "@/utils/getFileExtensionFromBase64String"
import { Box, Button, Heading, SimpleGrid, Spinner, Link as ChakraLink } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"

const ComponentVenues = () => {
    // const hasFetchedVenues = useRef<boolean>(false)
    // const jwtToken = useAppSelector(state => state.jwtSlice.token)
    const allVenues = useAppSelector(state => state.venuesSlice.venues)
    // const dispatch = useAppDispatch()

    // const getAllVenuesHandler = async () => {
    //     dispatch(setVenues({ venues: await getAllVenues(jwtToken) }))
    // }

    // useEffect(() => {
    //     if (hasFetchedVenues.current === false) {
    //         hasFetchedVenues.current = true
    //         getAllVenuesHandler()
    //     }
    // }, [])
    if(typeof allVenues === undefined) {
        return <h1>wow</h1>
    }

    if (allVenues.length <= 1 || typeof allVenues === undefined) {
        return <Spinner />
    }

    return (
        <Box>
            <Heading>Venues</Heading>
            <SimpleGrid columns={2} gap="100px">
                {allVenues.map(venue => {
                    let fileExtension = getFileExtensionFromBase64String(venue.venue_imagePath)
                    return (
                        <Link key={venue.venue_id} to={`venue/${venue.venue_id}`}>
                            <h1>{venue.venue_name}</h1>
                            <img
                                src={`data:image/${fileExtension};base64,${venue.venue_imagePath}`}
                                alt="testing"
                            />
                        </Link>
                    )
                })}
            </SimpleGrid>
        </Box>
    )
}

export default ComponentVenues
