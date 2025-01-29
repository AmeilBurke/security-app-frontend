import { getFullAccountDetails } from "@/api-requests/account/getFullAccountDetails"
import { getJwtDetails } from "@/api-requests/account/getJwtDetails"
import { getAndStoreJwt } from "@/api-requests/authentication/getJwt"
import { useAppDispatch } from "@/app/hooks"
import { Toaster, toaster } from "@/components/ui/toaster"
import { setUserAccountDetails } from "@/features/userAccountDetails/userAccountDetailsSlice"
import { getSocket } from "@/socket"
import { Box, Button, Heading, Input, VStack } from "@chakra-ui/react"
import { useState } from "react"

const PageLogin = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const dispatch = useAppDispatch()


    const showErrorToast = () => {
        toaster.create({
            title: "Log In Error",
            description: "Check your email & password then try again.",
            type: "error",
        })
    }

    const logUserInHandler = async () => {
        let jwtResult

        if (email === "" || password === "") {
            showErrorToast()
        } else {
            jwtResult = await getAndStoreJwt(email, password)
        }

        if (jwtResult === "error") {
            showErrorToast()
        } else {
            const jwtProfileResult = await getJwtDetails(jwtResult)
            if (jwtProfileResult === "error") {
                showErrorToast()
            }
            const fullProfileResult = await getFullAccountDetails(jwtResult, jwtProfileResult.sub)
            localStorage.setItem("jwt", jwtResult)
            dispatch(
                setUserAccountDetails(fullProfileResult)
            )
            getSocket().connect()
        }
    }

    return (
        <Box>
            <VStack>
                <Heading>Log In</Heading>
                <Input
                    type="text"
                    placeholder="Email"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setEmail(event.target.value)
                    }}
                />

                <Input
                    type="text"
                    placeholder="Password"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setPassword(event.target.value)
                    }}
                />
                <Button onClick={logUserInHandler}>Log In</Button>
            </VStack>
            <Toaster />
        </Box>
    )
}

export default PageLogin
