import { useAppSelector } from "@/app/hooks"
import { BannedPersonWithBanDetail, Venue } from "@/utils/types/indexTypes"
import { Box, Heading, Text, VStack, Image } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import ComponentCenteredSpinner from "../centered-spinner/ComponentCenteredSpinner"
import { utilGetFileTypeFromBase64String } from "@/utils/functions/utilGetFileTypeFromBase64String"

const ComponentBlanketBannedPersonCards = () => {
    const allBannedPeopleState = useAppSelector(state => state.bannedPeopleSlice)
    const allVenueState = useAppSelector(state => state.venuesSlice)
    const [allBlanketBannedPeople, setAllBlanketBannedPeople] = useState<
        BannedPersonWithBanDetail[] | undefined
    >(undefined)

    // if (allActiveAlertsState.data === null || allActiveAlertsState.data.alerts.length === 0) {

    useEffect(() => {
        if (
            allBannedPeopleState.data?.active_bans !== undefined &&
            allBannedPeopleState.data?.active_bans.length > 0 &&
            allVenueState.data.all_venues !== null &&
            allVenueState.data.all_venues.length > 0 &&
            allBlanketBannedPeople === undefined
        ) {
            const allVenueIdsSet = new Set<number>()

            allVenueState.data.all_venues.map((venue: Venue) => {
                allVenueIdsSet.add(venue.venue_id)
            })

            const peopleWithBlanketBans = allBannedPeopleState.data.active_bans.filter((bannedPersonWithBanDetails: BannedPersonWithBanDetail) => {
                const venueIdsSet = new Set<number>()
                bannedPersonWithBanDetails.BanDetail.some(banDetail => {
                    venueIdsSet.add(banDetail.banDetails_venueBanId)
                })

                if (venueIdsSet.size === allVenueIdsSet.size) {
                    return bannedPersonWithBanDetails
                }
            },
            )

            setAllBlanketBannedPeople(peopleWithBlanketBans)
        }
    }, [allBannedPeopleState, allVenueState, allBlanketBannedPeople])

    return (
        <Box>
            {
                allBlanketBannedPeople !== undefined
                    ? allBlanketBannedPeople.map((bannedPersonWithDetails: BannedPersonWithBanDetail) => {
                        const imageType = utilGetFileTypeFromBase64String(
                            bannedPersonWithDetails.bannedPerson_imageName
                        )
                        return (
                            <VStack key={bannedPersonWithDetails.bannedPerson_id}>
                                <Image
                                    h={[null, null, null, '30vh']}
                                    fit="cover"
                                    aspectRatio={1}
                                    bgColor="#FDFDFD"
                                    border="xs"
                                    borderColor={"lightgray"}
                                    shadow="sm"
                                    src={`data:${imageType};base64,${bannedPersonWithDetails.bannedPerson_imageName}`}
                                />
                                <Heading textTransform="capitalize">{bannedPersonWithDetails.bannedPerson_name}</Heading>
                            </VStack>
                        )
                    })
                    : null
            }
        </Box>
    )
}

export default ComponentBlanketBannedPersonCards
