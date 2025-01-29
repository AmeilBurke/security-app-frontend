import PageLogin from "./PageLogin"
import { Spinner, VStack } from "@chakra-ui/react"
import { getJwtFromLocalStorage } from "@/utils/getJwtFromLocalStorage"
import { useEffect, useState } from "react"
import { useAppSelector } from "@/app/hooks"

const PageDashboard = () => {
  const jwtToken = getJwtFromLocalStorage()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const accountId = useAppSelector(state => state.userAccountDetailsSlice.account_id)

  useEffect(() => {
    if (jwtToken !== null || jwtToken !== "" && isLoading) {
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return <Spinner />
  }

  if (jwtToken === null || (jwtToken === "" && !isLoading)) {
    return <PageLogin />
  }

  if (accountId !== -1) {
    return (
      <VStack w="full" p={0} m={0}>
        {/* <ComponentVenues /> */}
      </VStack>
    )
  }
}

export default PageDashboard
