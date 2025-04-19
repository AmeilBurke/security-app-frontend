import { postNewAlert } from "@/api-requests/alerts/postNewAlert"
import { getAllNonPendingBan } from "@/api-requests/banned-people/getAllNonPendingBan"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import ComponentContainer from "@/components/container/ComponentContainer"
import { toaster } from "@/components/ui/toaster"
import { setBannedPeopleState } from "@/features/bannedPeopleDetailsSlice"
import { setNavbarHeadingState } from "@/features/navbarHeadingSlice"
import { displayErrorToastForAxios } from "@/utils/helper-functions"
import { BannedPerson, isPrismaResultError } from "@/utils/types"
import {
  Accordion,
  Avatar,
  Center,
  HStack,
  RadioGroup,
  Span,
  Spinner,
  VStack,
  Text,
  Input,
  InputGroup,
  Separator,
  FileUpload,
  CloseButton,
  Field,
  Button,
  useFileUpload,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { GoPerson, GoUpload } from "react-icons/go"

const PageCreateAlert = () => {
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedBannedPersonName, setSelectedBannedPersonName] = useState<string>("")
  const [uploadedFile, setUploadedFile] = useState<File | undefined>(undefined)
  const [inputBannedPersonName, setInputBannedPersonName] = useState<string>("")
  const [inputExistingBannedPersonId, setInputExistingBannedPersonId] = useState<number>(-1)
  const [inputAlertReason, setInputAlertReason] = useState<string>("")
  const dispatch = useAppDispatch()
  const stateBannedPeople = useAppSelector(state => state.bannedPeopleDetailsSlice)
  const [filteredBannedPeople, setFilteredBannedPeople] = useState<BannedPerson[] | null>(null)

  const fileUpload = useFileUpload({
    accept: ['image/jpeg', 'image/png', 'image/webp'],
    required: true,
    maxFiles: 1,
    onFileAccept: (file) => {
      setUploadedFile(file.files[0])
    },
    onFileChange: (file) => {
      if (file.rejectedFiles[0]) {
        toaster.create({
          title: "Upload Error",
          description: "The file you tried to upload isn't valid",
          type: "error",
        })
        setUploadedFile(undefined)
        return
      }
      setUploadedFile(file.acceptedFiles[0])
    },
    onFileReject: () => {
      toaster.create({
        title: "Upload Error",
        description: "The file you tried to upload isn't valid",
        type: "error",
      })
      setUploadedFile(undefined)
    }
  })

  useEffect(() => {
    const getBannedPeopleHandler = async () => {
      setIsLoading(true)
      const result = await getAllNonPendingBan()

      if (isPrismaResultError(result)) {
        displayErrorToastForAxios(result)
        setFilteredBannedPeople(null)
        return
      }
      dispatch(setBannedPeopleState(result))
      setFilteredBannedPeople(result)
      setIsLoading(false)
    }

    if (isInitialLoad) {
      dispatch(setNavbarHeadingState("Create Alert"))
      getBannedPeopleHandler()
      setIsInitialLoad(false)
    }
  }, [isInitialLoad])

  const accordianBannedPeopleFilterHandler = (inputValue: string) => {
    if (inputValue === "") {
      setFilteredBannedPeople(stateBannedPeople.data)
      return
    }

    const result = stateBannedPeople.data?.filter(bannedPerson => {
      if (
        bannedPerson.bannedPerson_name
          .toLocaleLowerCase()
          .includes(inputValue.toLocaleLowerCase())
      ) {
        return bannedPerson
      }
    })

    if (result === undefined) {
      return
    }

    setFilteredBannedPeople(result)
    setSelectedBannedPersonName("null")
  }

  const uploadAlertHandler = async () => {
    if (
      uploadedFile === undefined ||
      inputAlertReason === "" ||
      (inputBannedPersonName === "" && selectedBannedPersonName === "")
    ) {
      return toaster.create({
        title: "Missing Required Fields",
        description: "Fill out the missing info & try again",
        type: "error",
      })
    }

    const alertDetails = new FormData()
    alertDetails.append(
      "alertDetail_name",
      inputBannedPersonName !== ""
        ? inputBannedPersonName
        : selectedBannedPersonName,
    )
    alertDetails.append("alertDetails_alertReason", inputAlertReason)
    alertDetails.append("file", uploadedFile)

    if (inputExistingBannedPersonId !== -1) {
      alertDetails.append(
        "alertDetail_bannedPersonId",
        String(inputExistingBannedPersonId),
      )
    }

    const result = await postNewAlert(alertDetails)

    if (isPrismaResultError(result)) {
      displayErrorToastForAxios(result)
      return
    }

    toaster.create({
      title: "Alert Uploaded",
      description: `An alert for ${inputBannedPersonName !== "" ? inputBannedPersonName : selectedBannedPersonName} has been put out`,
      type: "success",
    })

    setSelectedBannedPersonName("")
    setInputBannedPersonName("")
    setInputExistingBannedPersonId(-1)
    setInputAlertReason("")
    setUploadedFile(undefined)
    fileUpload.clearFiles()
  }

  if (isLoading) {
    return (
      <ComponentContainer>
        <Center>
          <Spinner />
        </Center>
      </ComponentContainer>
    )
  }

  return (
    <VStack gap={8} >
      <Accordion.Root collapsible variant="enclosed">
        <Accordion.Item key={-1} value={"-1"}>
          <Accordion.ItemTrigger>
            <Span flex={1}>Select From Previously Banned People</Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <VStack gap={8} alignItems="flex-start">
                <InputGroup w="full" startElement={<GoPerson />}>
                  <Input
                    onChange={event =>
                      accordianBannedPeopleFilterHandler(event.target.value)
                    }
                    type="text"
                    placeholder="Search Banned People"
                  />
                </InputGroup>

                <RadioGroup.Root
                  w="full"
                  defaultValue=""
                  value={selectedBannedPersonName}
                  onValueChange={event =>
                    setSelectedBannedPersonName(String(event.value))
                  }
                >
                  <VStack
                    maxH="50vh"
                    w="full"
                    gap={8}
                    alignItems="flex-start"
                    overflowY="auto"
                  >
                    <RadioGroup.Item
                      key={null}
                      w="full"
                      value={""}
                      onClick={() => setInputExistingBannedPersonId(-1)}
                    >
                      <RadioGroup.ItemHiddenInput />
                      <RadioGroup.ItemIndicator />
                      <RadioGroup.ItemText>None</RadioGroup.ItemText>
                    </RadioGroup.Item>
                    {filteredBannedPeople === null
                      ? null
                      : filteredBannedPeople.map(bannedPerson => {
                        return (
                          <RadioGroup.Item
                            key={bannedPerson.bannedPerson_id}
                            value={bannedPerson.bannedPerson_name}
                            onClick={event =>
                              setInputExistingBannedPersonId(
                                bannedPerson.bannedPerson_id,
                              )
                            }
                          >
                            <RadioGroup.ItemHiddenInput />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>
                              <HStack>
                                <Avatar.Root
                                  size="lg"
                                  key={bannedPerson.bannedPerson_id}
                                >
                                  <Avatar.Fallback
                                    name={bannedPerson.bannedPerson_name}
                                  />
                                  <Avatar.Image
                                    src={bannedPerson.bannedPerson_imagePath}
                                  />
                                </Avatar.Root>
                                <Text textTransform="capitalize">
                                  {bannedPerson.bannedPerson_name}
                                </Text>
                              </HStack>
                            </RadioGroup.ItemText>
                          </RadioGroup.Item>
                        )
                      })}
                  </VStack>
                </RadioGroup.Root>
              </VStack>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>

      <HStack w="full">
        <Separator w="full" />
        <Text mx={12}>OR</Text>
        <Separator w="full" />
      </HStack>

      <Field.Root>
        <Field.Label textTransform="capitalize">
          Name of person for alert
        </Field.Label>
        <Input
          type="text"
          placeholder="Enter name"
          disabled={selectedBannedPersonName !== "" ? true : false}
          onChange={event => setInputBannedPersonName(event.target.value)}
        />
      </Field.Root>

      <Separator w="full" />

      <FileUpload.RootProvider value={fileUpload} gap="1">
        <FileUpload.HiddenInput />
        <FileUpload.Label>
          Upload Image Of Person <Text as="span" color="red.500">*</Text>
        </FileUpload.Label>
        <InputGroup
          startElement={<GoUpload />}
          endElement={
            <FileUpload.ClearTrigger asChild>
              <CloseButton
                me="-1"
                size="xs"
                variant="plain"
                focusVisibleRing="inside"
                focusRingWidth="2px"
                pointerEvents="auto"
              />
            </FileUpload.ClearTrigger>
          }
        >
          <Input asChild>
            <FileUpload.Trigger>
              <FileUpload.FileText lineClamp={1} fallback="Upload Image" />
            </FileUpload.Trigger>
          </Input>
        </InputGroup>
      </FileUpload.RootProvider>

      <Separator w="full" />


      <Field.Root required>
        <Field.Label textTransform="capitalize">
          Reason for Alert <Field.RequiredIndicator />
        </Field.Label>
        <Input
          type="text"
          placeholder="Ban Reason"
          value={inputAlertReason}
          onChange={event => setInputAlertReason(event.target.value)}
        />
      </Field.Root>

      <Separator w="full" />

      <Button onClick={uploadAlertHandler} w="full">
        Upload Alert
      </Button>
    </VStack>
  )
}

export default PageCreateAlert
