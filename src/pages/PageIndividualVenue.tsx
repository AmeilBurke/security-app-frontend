// import { useAppDispatch, useAppSelector } from "@/app/hooks"
// import { useNavigate, useParams } from "react-router"
// import { useEffect, useState } from "react"
// import {
//     BanDetail,
//     BannedPersonWithBanDetail,
//     Venue,
// } from "@/utils/types/indexTypes"
// import {
//     Heading,
//     IconButton,
//     Spinner,
//     VStack,
//     Text,
//     SimpleGrid,
//     Image,
//     Stack,
// } from "@chakra-ui/react"
// import { GoChevronLeft } from "react-icons/go"
// import { setHeading } from "@/features/navbarHeading/navbarHeadingSlice"
// import ComponentBannedPersonCards from "@/components/banned-person-cards/ComponentBannedPersonCards"
// import dayjs from "dayjs"
// import { utilGetFileTypeFromBase64String } from "@/utils/functions/utilGetFileTypeFromBase64String"

// const PageIndividualVenue = () => {
//     const allVenueState = useAppSelector(state => state.venuesSlice)
//     const allBannedPeopleState = useAppSelector(state => state.bannedPeopleSlice)
//     const { venueId } = useParams()
//     const [selectedVenue, setSelectedVenue] = useState<Venue | undefined>(
//         undefined,
//     )
//     const [activeBans, setActiveBans] = useState<{ bannedPerson: BannedPersonWithBanDetail; latestBanDate: string }[]>([])
//     const [expiredBans, setExpiredBans] = useState<{ bannedPerson: BannedPersonWithBanDetail; latestBanDate: string }[]>([])

//     const navigate = useNavigate()
//     const dispatch = useAppDispatch()

//     useEffect(() => {

//         console.log('activeBans')
//         console.log(activeBans)

//         console.log('expiredBans')
//         console.log(expiredBans)

//         const filterActiveAndNonActive = () => {
//             let activeBansWithLatestDate: { bannedPerson: BannedPersonWithBanDetail; latestBanDate: string }[] = []
//             let expiredBansWithLatestDate: { bannedPerson: BannedPersonWithBanDetail; latestBanDate: string }[] = []

//             let activeBanIdSet = new Set<number>()

//             const currentVenueActiveBans = allBannedPeopleState.data?.active_bans.filter((bannedPersonWithDetail: BannedPersonWithBanDetail) => {
//                 return bannedPersonWithDetail.BanDetail.some((banDetail: BanDetail) => {
//                     return (
//                         banDetail.banDetails_venueBanId === Number(venueId)
//                     )
//                 })
//             })

//             if (currentVenueActiveBans !== undefined) {
//                 currentVenueActiveBans.filter((bannedPersonWithDetail: BannedPersonWithBanDetail) => {
//                     let latestBanDetailDate = bannedPersonWithDetail.BanDetail[0].banDetails_banEndDate

//                     bannedPersonWithDetail.BanDetail.map((banDetail: BanDetail) => {
//                         if (dayjs(banDetail.banDetails_banEndDate, "DD-MM-YYYY").isAfter(dayjs(latestBanDetailDate, "DD-MM-YYYY"))) {
//                             latestBanDetailDate = banDetail.banDetails_banEndDate
//                         }
//                     })

//                     activeBansWithLatestDate.push({
//                         bannedPerson: bannedPersonWithDetail,
//                         latestBanDate: latestBanDetailDate,
//                     })

//                     activeBanIdSet.add(bannedPersonWithDetail.bannedPerson_id)
//                 },
//                 )
//                 setActiveBans(activeBansWithLatestDate)
//             }

//             const currentVenueExpiredBans = allBannedPeopleState.data?.non_active_bans.filter((bannedPersonWithDetail: BannedPersonWithBanDetail) => {
//                 return bannedPersonWithDetail.BanDetail.some((banDetail: BanDetail) => {
//                     return (
//                         banDetail.banDetails_venueBanId === Number(venueId)
//                     )
//                 })
//             })

//             if (currentVenueExpiredBans !== undefined) {
//                 currentVenueExpiredBans.filter((bannedPersonWithBanDetail: BannedPersonWithBanDetail) => {
//                     let latestBanDetailDate = bannedPersonWithBanDetail.BanDetail[0].banDetails_banEndDate
//                     bannedPersonWithBanDetail.BanDetail.map((banDetail: BanDetail) => {

//                         if (dayjs(banDetail.banDetails_banEndDate, "DD-MM-YYYY").isAfter(dayjs(latestBanDetailDate, "DD-MM-YYYY"))) {
//                             latestBanDetailDate = banDetail.banDetails_banEndDate
//                         }
//                     })

//                     expiredBansWithLatestDate.push({
//                         bannedPerson: bannedPersonWithBanDetail,
//                         latestBanDate: latestBanDetailDate,
//                     })

//                 })

//                 setExpiredBans(expiredBansWithLatestDate.filter((expiredBans) => {
//                     if (!activeBanIdSet.has(expiredBans.bannedPerson.bannedPerson_id)) {
//                         return expiredBans
//                     }
//                 }))
//             }
//         }

//         if (allVenueState.isLoading) {
//             return
//         }

//         if (isNaN(Number(venueId))) {
//             navigate("/")
//             return
//         }

//         if (allVenueState.data?.all_venues === null) {
//             navigate("/")
//             return
//         }

//         const filteredVenue = allVenueState.data.all_venues?.filter(
//             (venue: Venue) => {
//                 return venue.venue_id === Number(venueId)
//             },
//         )

//         dispatch(setHeading(filteredVenue[0].venue_name))
//         setSelectedVenue(filteredVenue[0])

//         if (selectedVenue !== undefined && allBannedPeopleState) {
//             filterActiveAndNonActive()
//         }

//     }, [allVenueState, selectedVenue, allBannedPeopleState])

//     if (!activeBans) {
//         return <Spinner />
//     }

//     return (
//         <VStack w="full" px={4} m={0} gap={8} alignItems='start'>
//             <Text>Back button to be here</Text>
//             <VStack gap={4}>
//                 <Heading w="full" textAlign='start' >Active Bans</Heading>
//                 {
//                     activeBans
//                         ? <SimpleGrid gap={8} columns={[2, null, 4]}>
//                             {activeBans.map(
//                                 (bannedPerson: {
//                                     bannedPerson: BannedPersonWithBanDetail
//                                     latestBanDate: string
//                                 }) => {
//                                     const imageType = utilGetFileTypeFromBase64String(
//                                         bannedPerson.bannedPerson.bannedPerson_imageName,
//                                     )
//                                     return (
//                                         <VStack key={bannedPerson.bannedPerson.bannedPerson_id}>
//                                             <Image
//                                                 height="30vh"
//                                                 fit="cover"
//                                                 aspectRatio={1}
//                                                 bgColor="#FDFDFD"
//                                                 border="xs"
//                                                 borderColor={"lightgray"}
//                                                 shadow="sm"
//                                                 src={`data:${imageType};base64,${bannedPerson.bannedPerson.bannedPerson_imageName}`}
//                                             />
//                                             <Heading>{bannedPerson.bannedPerson.bannedPerson_name}</Heading>
//                                             <Text>{bannedPerson.latestBanDate}</Text>
//                                         </VStack>
//                                     )
//                                 },
//                             )}
//                         </SimpleGrid>
//                         : <Heading>There are no current active bans</Heading>
//                 }
//             </VStack>

//             <VStack gap={4}>
//                 <Heading w="full" textAlign='start' >Expired Bans</Heading>
//                 <SimpleGrid gap={8} columns={[2, null, 4]}>
//                     {expiredBans.map(
//                         (bannedPerson: {
//                             bannedPerson: BannedPersonWithBanDetail
//                             latestBanDate: string
//                         }) => {
//                             const imageType = utilGetFileTypeFromBase64String(
//                                 bannedPerson.bannedPerson.bannedPerson_imageName,
//                             )
//                             return (
//                                 <VStack key={bannedPerson.bannedPerson.bannedPerson_id} >
//                                     <Image
//                                         height="30vh"
//                                         fit="cover"
//                                         aspectRatio={1}
//                                         bgColor="#FDFDFD"
//                                         border="xs"
//                                         borderColor={"lightgray"}
//                                         shadow="sm"
//                                         src={`data:${imageType};base64,${bannedPerson.bannedPerson.bannedPerson_imageName}`}
//                                     />
//                                     <Heading>{bannedPerson.bannedPerson.bannedPerson_name}</Heading>
//                                     <Text>{bannedPerson.latestBanDate}</Text>
//                                 </VStack>
//                             )
//                         },
//                     )}
//                 </SimpleGrid>
//             </VStack>
//         </VStack>
//     )
// }

// export default PageIndividualVenue
