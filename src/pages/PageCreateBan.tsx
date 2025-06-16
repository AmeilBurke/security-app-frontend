import { postNewBanDetail } from "@/api-requests/ban-details/postNewBanDetail"
import { postNewBannedPerson } from "@/api-requests/banned-people/postNewBannedPerson"
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
import { ValueChangeDetails } from "@zag-js/radio-group"
import { useEffect, useState } from "react"
import { GoUpload } from "react-icons/go"
import dayjs from '../utils/helper-functions/dayjs-setup'

const PageCreateBan = () => {
    const dispatch = useAppDispatch()
    const socket = getSocket()
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true)
    const stateUser = useAppSelector(state => state.userAccountDetailsSlice.data)
    const stateNavbarHeading = useAppSelector(state => state.navbarHeadingSlice.heading)
    const stateVenues = useAppSelector(state => state.venuesSlice)
    const stateAllBannedPeople = useAppSelector(state => state.bannedPeopleDetailsSlice.data)
    const [stateAllBannedPeopleFiltered, setStateAllBannedPeopleFiltered] = useState<BannedPerson[]>([])

    const [uploadedImageFile, setUploadedImageFile] = useState<File | undefined>(undefined)
    const fileUploadValue = imageFileUploadHandler(setUploadedImageFile)

    const [inputBannedPersonName, setInputBannedPersonName] = useState<string>("")
    const [inputBannedPersonId, setInputBannedPersonId] = useState<number>(-1)
    const [inputBannedPersonSearch, setInputBannedPersonSearch] = useState<string>("")
    const [inputBanReason, setInputBanReason] = useState<string>("")

    const [inputBanEndDate, setInputBanEndDate] = useState<string>("")
    const [radioBanEndDate, setRadioBanEndDate] = useState<string | null>(null)

    const presetBanDurations = ["3 Months", "6 Months", "1 Year", "2 Years"]

    const [venueCheckboxes, setVenueCheckboxes] = useState<{ label: string; checked: boolean; value: number }[]>([])

    useEffect(() => {
        if (stateNavbarHeading !== "Create Ban") {
            dispatch(setNavbarHeadingState("Create Ban"))
        }

        if (stateUser !== null && isInitialLoad) {
            dispatch(fetchAllBannedPeople())
            setIsInitialLoad(false)
        }

    }, [stateNavbarHeading, stateUser, isInitialLoad])

    useEffect(() => {
        if (stateVenues.data !== null) {
            setVenueCheckboxes(
                stateVenues.data.map(venue => ({
                    label: venue.venue_name,
                    checked: false,
                    value: venue.venue_id,
                })),
            )
        }
    }, [stateVenues.data])

    useEffect(() => {
        if (stateAllBannedPeople !== null) {
            setStateAllBannedPeopleFiltered(stateAllBannedPeople)
        }
    }, [stateAllBannedPeople])



    const allChecked = venueCheckboxes.every(v => v.checked)
    const indeterminate = venueCheckboxes.some(v => v.checked) && !allChecked

    const uploadBanHandler = async () => {

        const hasVenuebeenSelected = venueCheckboxes.filter(value => {
            if (value.checked === true) {
                return value
            }
        })

        if (
            (uploadedImageFile === undefined && inputBannedPersonId === -1) ||
            (inputBannedPersonName.trim() === "" && inputBannedPersonId === -1) ||
            inputBanReason.trim() === "" ||
            (inputBanEndDate.trim() === "" && radioBanEndDate === null) ||
            hasVenuebeenSelected.length === 0
        ) {
            return toaster.create({
                title: "Missing Required Fields",
                description: "Fill out the missing info & try again",
                type: "error",
            })
        }

        if (!dayjs(inputBanEndDate, 'DD/MM/YYYY', true).isValid() && !dayjs(radioBanEndDate, 'DD/MM/YYYY', true).isValid()) {
            return toaster.create({
                title: "Invalid Date",
                description: "Enter a valid date and try again",
                type: "error",
            })
        }

        let result;

        if (inputBannedPersonId !== -1) {
            result = postNewBanDetail({
                banDetails_bannedPersonId: inputBannedPersonId,
                banDetails_reason: inputBanReason,
                banDetails_banEndDate: inputBanEndDate !== "" ? dayjs(inputBanEndDate, 'DD-MM-YYYY').toISOString() : dayjs(radioBanEndDate, 'DD-MM-YYYY').toISOString(),
                banDetails_venueBanIds: hasVenuebeenSelected.map(venue => { return venue.value })
            })
        } else {
            const banDetails = new FormData()
            banDetails.append("bannedPerson_name", inputBannedPersonName)
            banDetails.append("file", uploadedImageFile as File)
            banDetails.append("banDetails_reason", inputBanReason)
            banDetails.append("banDetails_banEndDate", inputBanEndDate !== "" ? dayjs(inputBanEndDate, 'DD-MM-YYYY').toISOString() : dayjs(radioBanEndDate, 'DD-MM-YYYY').toISOString())
            banDetails.append("banDetails_venueBanIds", String(hasVenuebeenSelected.map(venue => { return venue.value })))
            result = await postNewBannedPerson(banDetails)
        }

        if (isPrismaResultError(result)) {
            return displayErrorToastForAxios(result)
        }

        // need to change backend to decide what a non-admin account does, (maybe notify admin with a toast there is a pending ban/alert)
        if (inputBannedPersonId === -1) {
            socket.emit('createBanForNewPerson', { account_name: stateUser?.account_name })
        } else {
            socket.emit('createBanForExistingPerson', { account_name: stateUser?.account_name, bannedPerson_name: inputBannedPersonName })
        }

        setUploadedImageFile(undefined)
        fileUploadValue.clearFiles()
        setInputBannedPersonName("")
        setInputBanReason("")
        setInputBanEndDate("")
        setRadioBanEndDate("")
        setInputBannedPersonId(-1)
        const uncheckedBoxes = venueCheckboxes.map(checkbox => {
            checkbox.checked = false
            return checkbox
        })
        setVenueCheckboxes(uncheckedBoxes)
    }

    const banDateInputHandler = (inputValue: string) => {
        if (inputValue !== "" && radioBanEndDate !== null) {
            setRadioBanEndDate(null)
        }

        const prev = inputBanEndDate
        const isDeleting = inputValue.length < prev.length
        const digitsOnly = inputValue.replace(/\D/g, "").slice(0, 8)
        let formatted = ""

        if (digitsOnly.length <= 2) {
            formatted = digitsOnly
        } else if (digitsOnly.length <= 4) {
            formatted = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`
        } else {
            formatted = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}/${digitsOnly.slice(4)}`
        }

        if (isDeleting && prev.endsWith("/") && !inputValue.endsWith("/")) {
            formatted = formatted.slice(0, -1)
        }

        setInputBanEndDate(formatted)
    }

    const radioBanEndDateHandler = (event: ValueChangeDetails) => {
        setInputBanEndDate("")
        setRadioBanEndDate(String(event.value))
    }

    const radioBanEndDateValueHandler = (duration: string) => {
        let [timeValue, timeDuration] = duration.split(' ')
        const timeDurationShorthand = timeDuration.substring(0, 1).toLocaleLowerCase()

        if (timeDurationShorthand === "y") {
            return String(dayjs().add(Number(timeValue), 'year').format('DD/MM/YYYY'))
        }

        return String(dayjs().add(Number(timeValue), 'month').format('DD/MM/YYYY'))
    }

    const inputBannedPersonSearchHandler = (inputText: string) => {
        inputText = inputText.toLocaleLowerCase()
        setInputBannedPersonSearch(inputText)

        if (stateAllBannedPeople === null) {
            return
        }

        if (inputText === "") {
            setStateAllBannedPeopleFiltered(stateAllBannedPeople)
            return
        }

        const filteredSearchResult = stateAllBannedPeople.filter((bannedPerson) => {
            if (bannedPerson.bannedPerson_name.toLocaleLowerCase().includes(inputText)) {
                return bannedPerson
            }
        })
        setStateAllBannedPeopleFiltered(filteredSearchResult)
    }

    if (stateVenues.isLoading || !stateVenues.data || venueCheckboxes.length === 0) {
        return <Spinner />
    }

    return (
        <VStack w="full" alignItems="flex-start" gap={8}>

            {
                stateAllBannedPeople === null
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
                                                    setInputBannedPersonName("")
                                                    return
                                                }

                                                const result = stateAllBannedPeople.filter(bannedPerson => {
                                                    if (bannedPerson.bannedPerson_id === Number(event.value)) {
                                                        return bannedPerson
                                                    }
                                                })
                                                setInputBannedPersonName(result[0].bannedPerson_name)
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

            <Text>OR:</Text>

            <FileUpload.RootProvider value={fileUploadValue} gap="1" opacity={inputBannedPersonId === -1 ? 1 : 0.5}>
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
                    <Input asChild disabled={inputBannedPersonId === -1 ? false : true}>
                        <FileUpload.Trigger>
                            <FileUpload.FileText lineClamp={1} fallback="Upload Image" />
                        </FileUpload.Trigger>
                    </Input>
                </InputGroup>
            </FileUpload.RootProvider>

            <Field.Root required opacity={inputBannedPersonId === -1 ? 1 : 0.5}>
                <Field.Label>
                    Name Of Person For Ban <Field.RequiredIndicator />
                </Field.Label>
                <Input
                    type="text"
                    placeholder="Enter Name"
                    value={inputBannedPersonName}
                    onChange={event => setInputBannedPersonName(event.target.value)}
                    disabled={inputBannedPersonId === -1 ? false : true}
                />
            </Field.Root>


            <Field.Root required>
                <Field.Label>
                    Reason For Ban <Field.RequiredIndicator />
                </Field.Label>
                <Input
                    type="text"
                    placeholder="Ban Reason"
                    value={inputBanReason}
                    onChange={event => setInputBanReason(event.target.value)}
                />
            </Field.Root>

            <VStack gap={4} w="full" alignItems="flex-start">
                <Field.Root required>
                    <Field.Label>
                        Ban Until (DD/MM/YYYY) <Field.RequiredIndicator />
                    </Field.Label>
                    <Input
                        type="text"
                        placeholder="DD/MM/YYYY"
                        value={inputBanEndDate}
                        onChange={event => banDateInputHandler(event.target.value)}
                    />
                </Field.Root>

                <Text>OR:</Text>

                <RadioGroup.Root
                    value={radioBanEndDate}
                    onValueChange={event => {
                        radioBanEndDateHandler(event)
                    }}
                >
                    <VStack gap={4} alignItems="flex-start" textTransform="capitalize">
                        {presetBanDurations.map(duration => {
                            const radioValues = radioBanEndDateValueHandler(duration)
                            return (
                                <RadioGroup.Item key={duration} value={radioValues}>
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator />
                                    <RadioGroup.ItemText>{duration}</RadioGroup.ItemText>
                                </RadioGroup.Item>
                            )
                        })}
                    </VStack>
                </RadioGroup.Root>
            </VStack>

            <VStack
                gap={4}
                w="full"
                alignItems="flex-start"
                textTransform="capitalize"
            >
                <Heading>Venues To Be Banned From</Heading>

                <Checkbox.Root
                    checked={indeterminate ? "indeterminate" : allChecked}
                    onCheckedChange={e => {
                        setVenueCheckboxes(current =>
                            current.map(v => ({ ...v, checked: !!e.checked })),
                        )
                    }}
                >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control>
                        <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Checkbox.Label>All Venues</Checkbox.Label>
                </Checkbox.Root>

                {venueCheckboxes.map((venue, index) => (
                    <Checkbox.Root
                        ms="6"
                        key={venue.value}
                        checked={venue.checked}
                        onCheckedChange={e => {
                            setVenueCheckboxes(current => {
                                const newValues = [...current]
                                newValues[index] = {
                                    ...newValues[index],
                                    checked: !!e.checked,
                                }
                                return newValues
                            })
                        }}
                    >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label>{venue.label}</Checkbox.Label>
                    </Checkbox.Root>
                ))}
            </VStack>

            <Button onClick={uploadBanHandler}>Upload Ban</Button>
        </VStack>
    )
}

export default PageCreateBan
