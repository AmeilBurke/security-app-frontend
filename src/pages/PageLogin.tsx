import { fetchIndividualAccountDetails } from "@/api-requests/get/accounts/fetchIndividualAccountDetails"
import { fetchJwtToken } from "@/api-requests/get/accounts/fetchJwtToken"
import { fetchProfileInformationFromJwt } from "@/api-requests/get/accounts/fetchProfileInformationFromJwt"
import { useAppDispatch } from "@/app/hooks"
import { useColorMode } from "@/components/ui/color-mode"
import { InputGroup } from "@/components/ui/input-group"
import { Toaster, toaster } from "@/components/ui/toaster"
import { setUserAccountDetails } from "@/features/userAccountDetails/userAccountDetailsSlice"
import { getSocket } from "@/socket"
import { utilAxiosErrorToast } from "@/utils/utilAxiosErrorToast"
import { Box, Button, Heading, Input, VStack } from "@chakra-ui/react"
import axios, { AxiosError, AxiosResponse } from "axios"
import { useEffect, useRef, useState } from "react"
import { GoHash, GoPerson, GoSignIn } from "react-icons/go";
import { PrismaClientKnownRequestError } from "../utils/types/indexTypes"
import { isPrismaClientKnownRequestError } from "@/utils/helper-functions/indexHelperFunctions"

const PageLogin = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const dispatch = useAppDispatch()

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

      const fetchProfileInformationFromJwtResult = await fetchProfileInformationFromJwt()

      if (axios.isAxiosError(fetchProfileInformationFromJwtResult)) {
        utilAxiosErrorToast(fetchProfileInformationFromJwtResult)
        return
      } else if (isPrismaClientKnownRequestError(fetchProfileInformationFromJwtResult)) {
        utilAxiosErrorToast(fetchProfileInformationFromJwtResult)
        return
      }

      const fetchIndividualAccountDetailsResult = await fetchIndividualAccountDetails(
        (fetchProfileInformationFromJwtResult as AxiosResponse).data.sub,
      )

      if (axios.isAxiosError(fetchIndividualAccountDetailsResult)) {
        utilAxiosErrorToast(fetchIndividualAccountDetailsResult)
        return
      } else if (isPrismaClientKnownRequestError(fetchIndividualAccountDetailsResult)) {
        utilAxiosErrorToast(fetchIndividualAccountDetailsResult)
        return
      }

      dispatch(
        setUserAccountDetails(
          (fetchIndividualAccountDetailsResult as AxiosResponse).data,
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

  return (
    <Box>
      <VStack>
        <Heading>Log In</Heading>
        <InputGroup startElement={<GoPerson />} >
          <Input
            type="text"
            placeholder="Email"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(event.target.value)
            }}
          />
        </InputGroup>
        <InputGroup startElement={<GoHash />} >
          <Input
            type="text"
            placeholder="Password"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(event.target.value)
            }}
          />
        </InputGroup>


        <Button onClick={() => {
          logUserInHandler()
        }}><GoSignIn />Log In</Button>

      </VStack>
    </Box>
  )
}

export default PageLogin
