import { fetchIndividualAccountDetails } from "@/api-requests/get/accounts/fetchIndividualAccountDetails"
import { fetchJwtToken } from "@/api-requests/get/accounts/fetchJwtToken"
import { fetchProfileInformationFromJwt } from "@/api-requests/get/accounts/fetchProfileInformationFromJwt"
import { useAppDispatch } from "@/app/hooks"
import { InputGroup } from "@/components/ui/input-group"
import { toaster } from "@/components/ui/toaster"
import { getSocket } from "@/socket"
import { utilAxiosErrorToast } from "@/utils/utilAxiosErrorToast"
import { Box, Button, Center, Heading, Input, VStack } from "@chakra-ui/react"
import axios, { AxiosError, AxiosResponse } from "axios"
import { useEffect, useState } from "react"
import { GoHash, GoPerson, GoSignIn } from "react-icons/go"
import { isPrismaClientKnownRequestError } from "@/utils/helper-functions/indexHelperFunctions"
import { fetchUserAccountData } from "@/features/userAccountDetails/userAccountDetailsSlice"
import { useNavigate } from "react-router"

const PageLogin = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const logUserInHandler = async () => {
    try {
      let jwtResult: AxiosResponse | AxiosError | undefined

      if (email === "" || password === "") {
        toaster.create({
          title: "Log In Error",
          description: "Check your email & password then try again.",
          type: "error",
        })
        return
      } else {
        jwtResult = await fetchJwtToken(email, password)

        if (axios.isAxiosError(jwtResult)) {
          utilAxiosErrorToast(jwtResult)
          return
        } else if (isPrismaClientKnownRequestError(jwtResult)) {
          utilAxiosErrorToast(jwtResult.data)
          return
        } else {
          localStorage.setItem("jwt", jwtResult.data)
        }
      }

      if (typeof jwtResult === "undefined") {
        toaster.create({
          title: "Request Error",
          description: "There was an unspecified error, please try again",
          type: "error",
        })
        return
      }

      const fetchProfileInformationFromJwtResult =
        await fetchProfileInformationFromJwt()

      if (axios.isAxiosError(fetchProfileInformationFromJwtResult)) {
        utilAxiosErrorToast(fetchProfileInformationFromJwtResult)
        return
      } else if (
        isPrismaClientKnownRequestError(fetchProfileInformationFromJwtResult)
      ) {
        utilAxiosErrorToast(fetchProfileInformationFromJwtResult)
        return
      }

      const fetchIndividualAccountDetailsResult =
        await fetchIndividualAccountDetails(
          (fetchProfileInformationFromJwtResult as AxiosResponse).data.sub,
        )

      if (axios.isAxiosError(fetchIndividualAccountDetailsResult)) {
        utilAxiosErrorToast(fetchIndividualAccountDetailsResult)
        return
      } else if (
        isPrismaClientKnownRequestError(fetchIndividualAccountDetailsResult)
      ) {
        utilAxiosErrorToast(fetchIndividualAccountDetailsResult)
        return
      }

      dispatch(
        fetchUserAccountData(
          fetchIndividualAccountDetailsResult.data.account_id,
        ),
      )
      getSocket().connect()

      toaster.create({
        title: "Sign In sucessful",
        type: "success",
      })
    } catch (error: unknown) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (localStorage.getItem('jwt')) {
      navigate('/')
    }
  }, [])


  return (
    <Box mx={12} h="100vh">
      <Center h="full">
        <VStack spaceY={4}>
          <Heading>Log In</Heading>
          <Box w="full" spaceY={2}>
            <InputGroup w="full" startElement={<GoPerson />}>
              <Input
                type="text"
                placeholder="Email"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(event.target.value)
                }}
              />
            </InputGroup>
            <InputGroup w="full" startElement={<GoHash />}>
              <Input
                type="password"
                placeholder="Password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(event.target.value)
                }}
              />
            </InputGroup>
          </Box>

          <Button
            w="full"
            onClick={() => {
              logUserInHandler()
            }}
          >
            Log In
            <GoSignIn />
          </Button>
        </VStack>
      </Center>
    </Box>
  )
}

export default PageLogin
