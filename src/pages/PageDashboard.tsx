import { getAllNonPendingBan } from "@/api-requests/banned-people/getAllNonPendingBan"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import ComponentContainer from "@/components/container/ComponentContainer"
import { setBannedPeopleState } from "@/features/bannedPeopleDetailsSlice"
import { setNavbarHeadingState } from "@/features/navbarHeadingSlice"
import { displayErrorToastForAxios } from "@/utils/helper-functions"
import { isPrismaResultError } from "@/utils/types"
import { Button, Center, Spinner } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Link as RouterLink } from "react-router"

const PageDashboard = () => {
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true)
  const stateBannedPeople = useAppSelector(state => state.bannedPeopleDetailsSlice)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const getBannedPeopleHandler = async () => {
      const result = await getAllNonPendingBan()

      if (isPrismaResultError(result)) {
        displayErrorToastForAxios(result)
      }

      dispatch(setBannedPeopleState(result))
    }

    if (isInitialLoad) {
      dispatch(setNavbarHeadingState("Dashboard"))
      getBannedPeopleHandler()
      setIsInitialLoad(false)
    }
  }, [isInitialLoad])

  if (isInitialLoad || stateBannedPeople.data === null || stateBannedPeople.isLoading) {
    return <Spinner />
  }


  return (
    <RouterLink to="/create-alert">
      <Button w="full" >Create Alert</Button>
    </RouterLink>
  )
}

export default PageDashboard