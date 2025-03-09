import { useAppDispatch, useAppSelector } from "@/app/hooks"
import {
    FileUploadList,
    FileUploadRoot,
    FileUploadTrigger,
} from "@/components/ui/file-upload"
import { setHeading } from "@/features/navbarHeading/navbarHeadingSlice"
import { VStack, Button, Input, Heading, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { GoUpload } from "react-icons/go"
import { Field } from "@/components/ui/field"
import { Radio, RadioGroup } from "@/components/ui/radio"
import dayjs from "dayjs"
import { Checkbox } from "@/components/ui/checkbox"
import { Venue } from "@/utils/types/indexTypes"
import { FileAcceptDetails } from "@zag-js/file-upload"
import { toaster } from "@/components/ui/toaster"
import { getSocket } from "@/socket"

const PageUploadBan = () => {
    const [base64Image, setBase64Image] = useState<string | undefined>(undefined)
    const [bannedPersonName, setBannedPersonName] = useState<string | undefined>(undefined)
    const [banDetailReason, setBanDetailReason] = useState<string | undefined>(undefined)

    const [radioButtonValue, setRadioButtonValue] = useState<string>("")
    const [inputValue, setInputValue] = useState<string>("")

    const [checkBoxValues, setCheckBoxValues] = useState<{ label: string; checked: boolean; value: number }[]>([])

    const allVenuesState = useAppSelector(state => state.venuesSlice.data)
    const dispatch = useAppDispatch()

    const allChecked = checkBoxValues.every(
        checkBoxValues => checkBoxValues.checked,
    )
    const indeterminate =
        checkBoxValues.some(checkBoxValues => checkBoxValues.checked) && !allChecked
    const socket = getSocket()

    useEffect(() => {
        dispatch(setHeading("Upload Ban"))

        if (allVenuesState.all_venues) {
            let checkBoxVenueInitialValues = allVenuesState.all_venues.map(
                (venue: Venue) => {
                    return {
                        label: venue.venue_name,
                        checked: false,
                        value: venue.venue_id,
                    }
                },
            )
            setCheckBoxValues(checkBoxVenueInitialValues)
        }
    }, [allVenuesState])

    const onFileAcceptHandler = (fileAcceptDetails: FileAcceptDetails) => {
        const fileReader = new FileReader()

        if (fileAcceptDetails.files[0] === undefined) {
            toaster.create({
                title: "Invalid photo",
                description: "Upload another photo",
                type: "error",
            })
            return
        }

        fileReader.readAsDataURL(fileAcceptDetails.files[0])
        fileReader.onload = () => {
            const result = fileReader.result?.toString().split(",")[1]
            if (typeof result === "string") {
                setBase64Image(result)
            } else {
                toaster.create({
                    title: "Invalid photo",
                    description: "Upload another photo",
                })
                return
            }
        }
        fileReader.onerror = () => {
            toaster.create({
                title: "Invalid photo",
                description: "Upload another photo",
            })
            return
        }
    }

    const radioButtonChangeHandler = (value: string) => {
        setRadioButtonValue(value)
        setInputValue("")
    }

    const uploadBanHandler = () => {
        const venueBanIds = checkBoxValues.filter(value => {
            if (value.checked) {
                return value.value
            }
        })

        const venueIds = venueBanIds.map(value => {
            return value.value
        })

        if (
            base64Image === undefined ||
            bannedPersonName === undefined ||
            banDetailReason === undefined ||
            venueBanIds.length === 0 ||
            (inputValue === "" && radioButtonValue === "")
        ) {
            toaster.create({
                title: "Missing Information",
                description: "One or more fields are not filled out",
                type: "error",
            })
            return
        }

        let banDetailEndDate

        if (inputValue !== "") {
            banDetailEndDate = inputValue
        } else {
            banDetailEndDate = radioButtonValue
        }

        const bannedPersonDto = {
            bannedPerson_name: bannedPersonName,
            fileData: base64Image,
            banDetails: {
                banDetails_reason: banDetailReason,
                banDetails_banEndDate: banDetailEndDate,
                banDetails_venueBanIds: venueIds,
            },
        }
        socket.emit("addBannedPerson", bannedPersonDto)
    }

    return (
        <VStack
            w="full"
            px={4}
            paddingBottom={4}
            m={0}
            gap={8}
            alignItems="flex-start"
        >
            <FileUploadRoot
                maxFiles={1}
                accept={["image/jpeg", "image/png"]}
                onFileAccept={FileAcceptDetails => {
                    onFileAcceptHandler(FileAcceptDetails)
                }}
            >
                <FileUploadTrigger asChild>
                    <Button w="full" variant="outline">
                        <GoUpload /> Upload Picture Here
                    </Button>
                </FileUploadTrigger>
                <FileUploadList />
            </FileUploadRoot>

            <Field label="Name" required helperText="Enter the name of the person">
                <Input
                    placeholder="Name"
                    onChange={event => setBannedPersonName(event.target.value)}
                />
            </Field>

            <Field label="Reason" required helperText="Enter the reason for the ban">
                <Input
                    placeholder="Reason for ban"
                    onChange={event => setBanDetailReason(event.target.value)}
                />
            </Field>
            <Field
                label="Ban End Date"
                helperText="Format: DD-MM-YYYY OR select a date from below"
            >
                <VStack w="full" gap={4} alignItems="flex-start">
                    <Input
                        value={inputValue}
                        onChange={event => {
                            setInputValue(event.target.value)
                            setRadioButtonValue("")
                        }}
                        placeholder="Enter Date"
                    />
                </VStack>
            </Field>
            <RadioGroup
                value={radioButtonValue}
                onValueChange={value => {
                    radioButtonChangeHandler(value.value)
                    setInputValue("")
                }}
            >
                <VStack gap={4} alignItems="flex-start">
                    <Radio
                        value={dayjs().add(3, "month").format("DD-MM-YYYY")}
                    >{`3 Months: ${String(dayjs().add(3, "month").format("DD-MM-YYYY"))}`}</Radio>
                    <Radio
                        value={dayjs().add(6, "month").format("DD-MM-YYYY")}
                    >{`6 Months: ${String(dayjs().add(6, "month").format("DD-MM-YYYY"))}`}</Radio>
                    <Radio
                        value={dayjs().add(1, "year").format("DD-MM-YYYY")}
                    >{`1 Year: ${String(dayjs().add(1, "year").format("DD-MM-YYYY"))}`}</Radio>
                    <Radio
                        value={dayjs().add(2, "year").format("DD-MM-YYYY")}
                    >{`2 Years: ${String(dayjs().add(2, "year").format("DD-MM-YYYY"))}`}</Radio>
                </VStack>
            </RadioGroup>

            <VStack w="full" gap={4} alignItems="flex-start">
                <VStack w="full" gap={0} alignItems="flex-start">
                    <Heading>To be banned from:</Heading>
                    <Text>Select the venues they are to be banned from:</Text>
                </VStack>
                <VStack gap={4} alignItems="flex-start">
                    <Checkbox
                        checked={indeterminate ? "indeterminate" : allChecked}
                        onCheckedChange={checkedChangeDetails => {
                            const updatedValues = checkBoxValues.map(checkBoxValue => {
                                return {
                                    ...checkBoxValue,
                                    checked: Boolean(checkedChangeDetails.checked),
                                }
                            })
                            setCheckBoxValues(updatedValues)
                        }}
                    >
                        All Venues
                    </Checkbox>
                    {checkBoxValues !== null
                        ? checkBoxValues.map(
                            (
                                checkBox: { label: string; checked: boolean; value: number },
                                index: number,
                            ) => {
                                return (
                                    <Checkbox
                                        key={checkBox.value}
                                        checked={checkBox.checked}
                                        onCheckedChange={CheckedChangeDetails => {
                                            let newValues = [...checkBoxValues]
                                            newValues[index] = {
                                                ...newValues[index],
                                                checked: Boolean(CheckedChangeDetails.checked),
                                            }
                                            setCheckBoxValues(newValues)
                                        }}
                                        marginStart={4}
                                        textTransform="capitalize"
                                    >
                                        {checkBox.label}
                                    </Checkbox>
                                )
                            },
                        )
                        : null}
                </VStack>
            </VStack>
            <Button onClick={uploadBanHandler}>Upload Ban</Button>
        </VStack>
    )
}

export default PageUploadBan
