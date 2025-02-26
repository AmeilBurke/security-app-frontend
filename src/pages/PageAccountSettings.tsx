import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { Field } from "@/components/ui/field"
import { InputGroup } from "@/components/ui/input-group"
import { toaster } from "@/components/ui/toaster"
import { Box, Button, Heading, Input, Spinner, StackSeparator, VStack } from "@chakra-ui/react"
import React, { useEffect, useRef, useState } from "react"
import { GoPerson, GoHash, GoMultiSelect, GoTrash, GoUpload } from "react-icons/go"
import {
  ActionBarCloseTrigger,
  ActionBarContent,
  ActionBarRoot,
  ActionBarSelectionTrigger,
  ActionBarSeparator,
} from "@/components/ui/action-bar"
import { Checkbox } from "@/components/ui/checkbox"
import { updateUserAccountDetails } from "@/api-requests/update/updateUserAccountDetails"
import { Account } from "@/utils/types/indexTypes"
import PageLogin from "./PageLogin"
import axios from "axios"
import { utilAxiosErrorToast } from "@/utils/utilAxiosErrorToast"
import ComponentCenteredSpinner from "@/components/centered-spinner/ComponentCenteredSpinner"
import { fetchUserAccountData, setUserAccountState } from "@/features/userAccountDetails/userAccountDetailsSlice"
import { setHeading } from "@/features/navbarHeading/navbarHeadingSlice"

const PageAccountSettings = () => {
  const userAccountState = useAppSelector(state => state.userAccountDetailsSlice)
  const dispatch = useAppDispatch()

  const [accountEmail, setAccountEmail] = useState<string>("")
  const [accountPassword, setAccountPassword] = useState<string>("")
  const [accountConfirmationPassword, setAccountConfirmationPassword] = useState<string>("")
  const [accountName, setAccountName] = useState<string>("")
  const [hasEditedAField, setHasEditedAField] = useState<boolean>(false)
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    dispatch(setHeading('account settings'))
  }, [])
  

  const accountEmailHandler = (text: string) => {
    if (text === "") {
      setHasEditedAField(false)
      return
    } else {
      setHasEditedAField(true)
      setAccountEmail(text)
    }
  }

  const accountPasswordHandler = (text: string) => {
    if (text === "") {
      setHasEditedAField(false)
      return
    } else {
      setHasEditedAField(true)
      setAccountPassword(text)
    }
  }

  const accountConfirmationPasswordHandler = (text: string) => {
    if (text === "") {
      setHasEditedAField(false)
      return
    } else {
      setHasEditedAField(true)
      setAccountConfirmationPassword(text)
    }
  }

  const accountNameHandler = (text: string) => {
    if (text === "") {
      setHasEditedAField(false)
      return
    } else {
      setHasEditedAField(true)
      setAccountName(text)
    }
  }

  const discardHandler = () => {
    Object.values(inputRefs.current).forEach((input) => {
      if (input) {
        input.value = ""
      }
    })
    setAccountEmail("")
    setAccountPassword("")
    setAccountConfirmationPassword("")
    setAccountName("")
    setHasEditedAField(false)
  }

  const updateAccountDetailsHandler = async () => {

    let userDetailsToUpdate: { account_email?: string, account_old_password: string | undefined, account_password?: string, account_name?: string } = { account_old_password: undefined }

    if (accountEmail !== "") {
      userDetailsToUpdate.account_email = accountEmail
    }

    if (accountPassword !== "" && accountPassword === accountConfirmationPassword) {
      userDetailsToUpdate.account_password = accountPassword
    }

    if (accountName !== "") {
      userDetailsToUpdate.account_name = accountName
    }

    if (typeof userAccountState.data === null || typeof userAccountState.data?.account_id !== 'number') {
      return
    }

    const updateUserAccountDetailsResult = await updateUserAccountDetails(userAccountState.data.account_id, userDetailsToUpdate)

    if (axios.isAxiosError(updateUserAccountDetailsResult)) {
      utilAxiosErrorToast(updateUserAccountDetailsResult)
      return
    }

    dispatch(fetchUserAccountData(updateUserAccountDetailsResult.data.account_id))

    toaster.success({
      title: 'Update success!',
      description: 'your account has been updated successfully'
    })

    setHasEditedAField(false)

    // location.reload()
  }

  if (userAccountState.isLoading) {
    return (
      <ComponentCenteredSpinner />
    )
  }

  if (userAccountState.data === null && !userAccountState.isLoading) {
    return <PageLogin />
  }

  return (
    <VStack p={[5]} gap={8} alignItems={["flex-start"]}>
      <Heading as="h1" fontWeight="semibold">
        Account Settings
      </Heading>

      <VStack w="full" gap={8} separator={<StackSeparator />} >
        <Field label="Change your email">
          <InputGroup w="full" startElement={<GoPerson />}>
            <Input
              ref={(element) => { inputRefs.current["accountEmail"] = element }}
              type="text"
              placeholder={userAccountState.data?.account_email}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                accountEmailHandler(event.target.value)
              }}
            />
          </InputGroup>
        </Field>

        <VStack w="full" gap={8}>

          <Field label="Change your password">
            <InputGroup w="full" startElement={<GoHash />}>
              <Input
                ref={(element) => { inputRefs.current["accountPassword"] = element }}
                type="password"
                placeholder="Password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  accountPasswordHandler(event.target.value)
                }}
              />
            </InputGroup>
          </Field>

          <Field label="Confirm your password">
            <InputGroup w="full" startElement={<GoHash />}>
              <Input
                ref={(element) => { inputRefs.current["accountConfirmPassword"] = element }}
                type="password"
                placeholder="Confirm Password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  accountConfirmationPasswordHandler(event.target.value)
                }}
              />
            </InputGroup>
          </Field>
        </VStack>

        <Field label="Change your name">
          <InputGroup w="full" startElement={<GoMultiSelect />}>
            <Input
              ref={(element) => { inputRefs.current["accountName"] = element }}
              type="text"
              placeholder={userAccountState.data?.account_name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                accountNameHandler(event.target.value)
              }}
            />
          </InputGroup>
        </Field>
      </VStack>
      <>
        <ActionBarRoot
          open={hasEditedAField}
          closeOnInteractOutside={false}
        >
          <ActionBarContent>
            <Button onClick={discardHandler} variant="solid" colorPalette="red" size="sm">
              <GoTrash />
              Discard
            </Button>
            <Button onClick={updateAccountDetailsHandler} variant="solid" colorPalette="green" size="sm">
              <GoUpload />
              Update Details
            </Button>
          </ActionBarContent>
        </ActionBarRoot>
      </>
    </VStack>
  )

}

export default PageAccountSettings
