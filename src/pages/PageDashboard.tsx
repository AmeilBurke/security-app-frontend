// import { useAppDispatch, useAppSelector } from "@/app/hooks"
// import PageLogin from "./PageLogin"
// import { Box, Button, VStack } from "@chakra-ui/react"
// import ComponentCenteredSpinner from "@/components/centered-spinner/ComponentCenteredSpinner"
// import ComponentActiveAlertCards from "@/components/active-alert-cards/ComponentActiveAlertCards"
// import ComponentVenueCards from "@/components/venue-cards/ComponentVenueCards"
// import { setHeading } from "@/features/navbarHeading/navbarHeadingSlice"
// import { useEffect } from "react"
// import { Link as ReactRouterLink } from "react-router"

// const PageDashboard = () => {
//   const jwtToken = localStorage.getItem("jwt")
//   const userAccountState = useAppSelector(state => { return state.userAccountDetailsSlice })
//   const dispatch = useAppDispatch()

//   useEffect(() => {
//     dispatch(setHeading('dashboard'))
//   }, [])

//   if (userAccountState.isLoading) {
//     return <ComponentCenteredSpinner />
//   }

//   if (jwtToken === null || (jwtToken === "" && !userAccountState.isLoading)) {
//     return <PageLogin />
//   }

//   if (userAccountState.data !== null) {
//     return (
//       <VStack w="full" p={4} m={0} gap={8}>
//         <VStack w="full" gap={8} >
//           <Box w="full">
//             <ReactRouterLink to={'add-alert'}><Button w="full">Add New Alert</Button></ReactRouterLink>
//           </Box>
//           <Box w="full">
//             <ReactRouterLink to={'upload-ban'}><Button w="full">Add New Ban</Button></ReactRouterLink>
//           </Box>
//         </VStack>
//         <ComponentActiveAlertCards />
//         <ComponentVenueCards />
//         {/* <ComponentBlanketBannedPersonCards /> */}
//       </VStack>
//     )
//   }
// }

// export default PageDashboard
