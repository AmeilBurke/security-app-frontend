// import { getAllBannedByVenueId } from '@/api-requests/venues/getAllBannedPeopleByVenueId'
import { useAppSelector } from '@/app/hooks'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'

const PageIndividualVenue = () => {
    const hasFetchedVenue = useRef<boolean>(false)
    const [venueDetails, setVenueDetails] = useState<any>()
    const jwtToken = useAppSelector(state => state.jwtSlice.token)

    // let { venueId } = useParams()

    // const getVenueDetails = async () => {
    //     setVenueDetails(await getAllBannedByVenueId(jwtToken, String(venueId)))
    // }

    // useEffect(() => {
    //     if (!hasFetchedVenue && jwtToken !== undefined) {
    //         getVenueDetails()
    //     }
    // }, [])


    return (
        <div>
            <h1>PageIndividualVenue. Id: {venueId}</h1>
            <p>{venueDetails}</p>
        </div>
    )
}

export default PageIndividualVenue