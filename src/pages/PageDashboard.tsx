import { useAppSelector } from "@/app/hooks"
import PageLogin from "./PageLogin"
import { Spinner, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"

const PageDashboard = () => {
  const jwtToken = localStorage.getItem("jwt")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const accountId = useAppSelector(
    state => state.userAccountDetailsSlice.account_id,
  )

  useEffect(() => {
    if (jwtToken !== null || (jwtToken !== "" && isLoading)) {
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
        <h1>Good Job</h1>
      </VStack>
    )
  }
}

export default PageDashboard
