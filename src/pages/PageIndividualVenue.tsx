import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { useNavigate, useParams, } from 'react-router'
import { useEffect, useState } from 'react'
import { BanDetail, BannedPerson, BannedPersonWithBanDetail, Venue } from '@/utils/types/indexTypes'
import { IconButton, Spinner, VStack } from '@chakra-ui/react'
import { GoChevronLeft } from 'react-icons/go'
import { setHeading } from '@/features/navbarHeading/navbarHeadingSlice'

const PageIndividualVenue = () => {

    const allVenueState = useAppSelector(state => state.venuesSlice)
    const allBannedPeopleState = useAppSelector(state => state.bannedPeopleSlice)
    const { venueId } = useParams()
    const [selectedVenue, setSelectedVenue] = useState<Venue | undefined>(undefined)

    const [selectedVenueActiveBans, setSelectedVenueActiveBans] = useState<BannedPersonWithBanDetail[] | undefined>();
    const [selectedVenueExpiredBans, setSelectedVenueExpiredBans] = useState<BannedPersonWithBanDetail[] | undefined>();
    const [hasFilteredBans, setHasFilteredBans] = useState<boolean>(false)

    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    useEffect(() => {

        if (selectedVenue?.venue_name) {
            dispatch(setHeading(selectedVenue?.venue_name))
        }

        if (selectedVenue?.venue_id && !hasFilteredBans) {
            let idsOfBannedPeopleWithActiveBan = new Set<number | undefined>(undefined)

            const bannedPeopleWithActiveBanFromVenue = allBannedPeopleState.data?.active_bans.filter((bannedPerson: BannedPersonWithBanDetail) => {
                return bannedPerson.BanDetail.map((banDetail: BanDetail) => {
                    if (banDetail.banDetails_venueBanId === selectedVenue.venue_id && !idsOfBannedPeopleWithActiveBan.has(banDetail.banDetails_bannedPersonId)) {
                        idsOfBannedPeopleWithActiveBan.add(banDetail.banDetails_bannedPersonId)
                    }
                })
            })
            setSelectedVenueActiveBans(bannedPeopleWithActiveBanFromVenue)

            const bannedPeopleWithExpiredBanFromVenue = allBannedPeopleState.data?.non_active_bans.filter((bannedPerson: BannedPersonWithBanDetail) => {
                return bannedPerson.BanDetail.map((banDetail: BanDetail) => {
                    if (banDetail.banDetails_venueBanId === selectedVenue.venue_id) {
                        return banDetail.banDetails_bannedPersonId
                    }
                })
            })

            const bannedPeopleWithExpiredBanAndNoActiveBan = bannedPeopleWithExpiredBanFromVenue?.filter((bannedPerson: BannedPersonWithBanDetail) => {
                if (!idsOfBannedPeopleWithActiveBan.has(bannedPerson.bannedPerson_id)) {
                    return bannedPerson.bannedPerson_id
                }
            })

            setSelectedVenueExpiredBans(bannedPeopleWithExpiredBanAndNoActiveBan)

            setHasFilteredBans(true)

            console.log(bannedPeopleWithActiveBanFromVenue)
            console.log(bannedPeopleWithExpiredBanAndNoActiveBan)
        }


        if (allVenueState.isLoading) {
            return
        }

        if (isNaN(Number(venueId))) {
            navigate('/')
            return
        }

        if (allVenueState.data?.all_venues === null) {
            navigate('/')
            return
        }

        const filteredVenues = allVenueState.data.all_venues?.filter((venue: Venue) => {
            return venue.venue_id === Number(venueId)
        })

        if (filteredVenues === undefined || filteredVenues.length === 0) {
            navigate('/')
        } else {
            setSelectedVenue(filteredVenues[0])
        }
    }, [venueId, allVenueState.isLoading, selectedVenue, selectedVenueActiveBans, selectedVenueExpiredBans])

    if (allVenueState.isLoading || selectedVenue === undefined) {
        return <Spinner />
    }

    return (
        <VStack w="full" px={4} m={0} alignItems='flex-start' gap={4}>
            <IconButton variant='outline' _hover={{ cursor: 'button' }} >
                <GoChevronLeft onClick={() => navigate(-1)} />
            </IconButton>



        </VStack>
    )

}

export default PageIndividualVenue