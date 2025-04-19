import { getJwt } from '@/api-requests/authentication/getJwt'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import ComponentContainer from '@/components/container/ComponentContainer'
import { toaster } from '@/components/ui/toaster'
import { fetchUserAccountDetails } from '@/features/userAccountDetailsSlice'
import { displayErrorToastForAxios } from '@/utils/helper-functions'
import { isPrismaResultError } from '@/utils/types'
import { Box, Center, Input, VStack, Button, Heading, InputGroup, Spinner } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { GoPerson, GoHash, GoSignIn } from 'react-icons/go'
import { useNavigate } from 'react-router'

const PageSignIn = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const dispatch = useAppDispatch()
    const stateUserAccount = useAppSelector(state => state.userAccountDetailsSlice)
    const navigate = useNavigate()

    const signUserInHandler = async () => {
        if (email === "" || password === "") {
            toaster.create({
                title: "Sign In Error",
                description: "Enter your email & password then try again",
                type: 'error'
            })
            return
        }

        dispatch(fetchUserAccountDetails({ email: email, password: password }))

        const result = await getJwt(email, password)

        if (isPrismaResultError(result)) {
            displayErrorToastForAxios(result)
        } else {
            toaster.create({
                title: 'Sign In Successful',
                description: `Welcome ${result.account_name}`,
                type: 'success'
            })
        }

    }

    useEffect(() => {
        if (stateUserAccount.data !== null) {
            navigate("/")
        }
    }, [stateUserAccount.data])

    return (
        <Center h="100vh" maxWidth='breakpoint-2xl' mx='auto' px={8} >
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
                        signUserInHandler()
                    }}
                >
                    Log In
                    <GoSignIn />
                </Button>
            </VStack>
        </Center>
    )
}

export default PageSignIn