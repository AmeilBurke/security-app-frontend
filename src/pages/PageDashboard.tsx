import { useAppSelector } from "@/app/hooks"
import PageLogin from "./PageLogin"
import { VStack } from "@chakra-ui/react"
import ComponentCenteredSpinner from "@/components/centered-spinner/ComponentCenteredSpinner"
import ComponentActiveAlertCards from "@/components/active-alert-cards/ComponentActiveAlertCards"
import ComponentVenueCards from "@/components/venue-cards/ComponentVenueCards"

const PageDashboard = () => {
  const jwtToken = localStorage.getItem("jwt")
  const userAccountState = useAppSelector(state => { return state.userAccountDetailsSlice })

  if (userAccountState.isLoading) {
    return <ComponentCenteredSpinner />
  }

  if (jwtToken === null || (jwtToken === "" && !userAccountState.isLoading)) {
    return <PageLogin />
  }

  if (userAccountState.data !== null) {
    return (
      <VStack w="full" p={0} m={0}>
        <ComponentActiveAlertCards />
        <ComponentVenueCards />
      </VStack>
    )
  }
}

export default PageDashboard
