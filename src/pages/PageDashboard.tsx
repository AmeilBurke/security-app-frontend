import { useAppSelector } from "@/app/hooks"
import PageLogin from "./PageLogin"
import { Input, Spinner, VStack, InputAddon } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { InputGroup } from "@/components/ui/input-group"


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
        <InputGroup children={
          <>
            <InputAddon>+234</InputAddon>
            <Input type='tel' placeholder='phone number' />
          </>
        }>

        </InputGroup>
      </VStack>
    )
  }
}

export default PageDashboard
