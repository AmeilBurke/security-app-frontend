import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { toaster } from "@/components/ui/toaster"
import { fetchAllBannedPeople } from "@/features/bannedPeopleDetailsSlice"
import { setNavbarHeadingState } from "@/features/navbarHeadingSlice"
import { getSocket } from "@/socket"
import { displayErrorToastForAxios, imageFileUploadHandler } from "@/utils/helper-functions"
import { BannedPerson, isPrismaResultError } from "@/utils/types"
import {
    CloseButton,
    FileUpload,
    Input,
    InputGroup,
    VStack,
    Text,
    Field,
    Spinner,
    RadioGroup,
    Heading,
    Checkbox,
    Button,
    Accordion,
    Span,
    Avatar,
    AvatarGroup,
    HStack,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { GoUpload } from "react-icons/go"
import { postNewAlert } from "@/api-requests/alert-details/postNewAlert"
import { useLoaderData } from "react-router"

const PageCreateAlert = () => {
    const allBannedPeople = useLoaderData<BannedPerson[]>()
    const dispatch = useAppDispatch()
    const socket = getSocket()
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true)
    const stateUser = useAppSelector(state => state.userAccountDetailsSlice.data)
    const stateNavbarHeading = useAppSelector(state => state.navbarHeadingSlice.heading)
    const stateVenues = useAppSelector(state => state.venuesSlice)
    const [stateAllBannedPeopleFiltered, setStateAllBannedPeopleFiltered] = useState<BannedPerson[]>([])

    const [uploadedImageFile, setUploadedImageFile] = useState<File | undefined>(undefined)
    const fileUploadValue = imageFileUploadHandler(setUploadedImageFile)

    const [inputAlertPersonName, setInputAlertPersonName] = useState<string>("")
    const [inputBannedPersonId, setInputBannedPersonId] = useState<number>(-1)
    const [inputBannedPersonSearch, setInputBannedPersonSearch] = useState<string>("")
    const [inputAlertReason, setInputAlertReason] = useState<string>("")

    useEffect(() => {
        if (stateNavbarHeading !== "Create Alert") {
            dispatch(setNavbarHeadingState("Create Alert"))
        }

        if (stateUser !== null && isInitialLoad) {
            dispatch(fetchAllBannedPeople())
            setIsInitialLoad(false)
        }

    }, [stateNavbarHeading, stateUser, isInitialLoad])

    useEffect(() => {
        if (allBannedPeople !== null) {
            setStateAllBannedPeopleFiltered(allBannedPeople)
        }
    }, [allBannedPeople])

    const uploadAlertHandler = async () => {

        if (
            (uploadedImageFile === undefined && inputBannedPersonId === -1) ||
            (inputAlertPersonName.trim() === "" && inputBannedPersonId === -1) ||
            inputAlertReason.trim() === ""
        ) {
            return toaster.create({
                title: "Missing Required Fields",
                description: "Fill out the missing info & try again",
                type: "error",
            })
        }

        const alertDetails = new FormData()
        alertDetails.append('alertDetail_name', inputAlertPersonName)
        alertDetails.append('alertDetail_alertReason', inputAlertReason)
        alertDetails.append('file', uploadedImageFile as File)

        if (inputBannedPersonId !== -1) {
            alertDetails.append('alertDetail_bannedPersonId', String(inputBannedPersonId))
        }

        const result = await postNewAlert(alertDetails)

        if (isPrismaResultError(result)) {
            return displayErrorToastForAxios(result)
        }

        socket.emit('createAlert', { account_name: stateUser?.account_name })

        setUploadedImageFile(undefined)
        fileUploadValue.clearFiles()
        setInputAlertPersonName("")
        setInputAlertReason("")
        setInputBannedPersonId(-1)
    }

    const inputBannedPersonSearchHandler = (inputText: string) => {
        inputText = inputText.toLocaleLowerCase()
        setInputBannedPersonSearch(inputText)

        if (allBannedPeople === null) {
            return
        }

        if (inputText === "") {
            setStateAllBannedPeopleFiltered(allBannedPeople)
            return
        }

        const filteredSearchResult = allBannedPeople.filter((bannedPerson) => {
            if (bannedPerson.bannedPerson_name.toLocaleLowerCase().includes(inputText)) {
                return bannedPerson
            }
        })
        setStateAllBannedPeopleFiltered(filteredSearchResult)
    }

    if (stateVenues.isLoading || !stateVenues.data) {
        return <Spinner />
    }

    return (
        <VStack w="full" alignItems="flex-start" gap={8}>
            {
                allBannedPeople === null
                    ? null
                    : <Accordion.Root collapsible variant='enclosed' >
                        <Accordion.Item key={1} value={"1"} >
                            <Accordion.ItemTrigger>
                                <Span flex="1">Select From Previously Banned People</Span>
                                <Accordion.ItemIndicator />
                            </Accordion.ItemTrigger>
                            <Accordion.ItemContent>
                                <Accordion.ItemBody>
                                    <VStack gap={4} alignItems="flex-start" textTransform="capitalize">

                                        <Input placeholder="Search Banned People" value={inputBannedPersonSearch} onChange={(event) => inputBannedPersonSearchHandler(event.target.value)} />

                                        <RadioGroup.Root
                                            value={String(inputBannedPersonId)}
                                            onValueChange={event => {
                                                setInputBannedPersonId(Number(event.value))

                                                if (Number(event.value) === -1) {
                                                    setInputAlertPersonName("")
                                                    return
                                                }

                                                const result = allBannedPeople.filter(bannedPerson => {
                                                    if (bannedPerson.bannedPerson_id === Number(event.value)) {
                                                        return bannedPerson
                                                    }
                                                })
                                                setInputAlertPersonName(result[0].bannedPerson_name)
                                            }}
                                        >

                                            <VStack gap={4} alignItems="flex-start" textTransform="capitalize">

                                                <RadioGroup.Item key={-1} value={String(-1)}>
                                                    <RadioGroup.ItemHiddenInput />
                                                    <RadioGroup.ItemIndicator />
                                                    <RadioGroup.ItemText>
                                                        None
                                                    </RadioGroup.ItemText>
                                                </RadioGroup.Item>

                                                {stateAllBannedPeopleFiltered.map(bannedPerson => {
                                                    return (
                                                        <RadioGroup.Item key={bannedPerson.bannedPerson_id} value={String(bannedPerson.bannedPerson_id)}>
                                                            <RadioGroup.ItemHiddenInput />
                                                            <RadioGroup.ItemIndicator />
                                                            <RadioGroup.ItemText>
                                                                <HStack gap={4} justifyContent='center' >
                                                                    <AvatarGroup>
                                                                        <Avatar.Root>
                                                                            <Avatar.Fallback />
                                                                            <Avatar.Image src={bannedPerson.bannedPerson_imagePath} />
                                                                        </Avatar.Root>
                                                                    </AvatarGroup>
                                                                    <Text>{bannedPerson.bannedPerson_name}</Text>
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
            }

            <FileUpload.RootProvider value={fileUploadValue} gap="1">
                <FileUpload.HiddenInput />
                <FileUpload.Label>
                    Upload Image Of Person{" "}
                    <Text as="span" color="red.500">
                        *
                    </Text>
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

            <Field.Root required opacity={inputBannedPersonId === -1 ? 1 : 0.5}>
                <Field.Label>
                    Name Of Person For Alert <Field.RequiredIndicator />
                </Field.Label>
                <Input
                    type="text"
                    placeholder="Enter Name"
                    value={inputAlertPersonName}
                    onChange={event => setInputAlertPersonName(event.target.value)}
                    disabled={inputBannedPersonId === -1 ? false : true}
                />
            </Field.Root>


            <Field.Root required>
                <Field.Label>
                    Reason For Alert <Field.RequiredIndicator />
                </Field.Label>
                <Input
                    type="text"
                    placeholder="Ban Reason"
                    value={inputAlertReason}
                    onChange={event => setInputAlertReason(event.target.value)}
                />
            </Field.Root>

            <Button onClick={uploadAlertHandler}>Upload Alert</Button>
        </VStack>
    )
}

export default PageCreateAlert
