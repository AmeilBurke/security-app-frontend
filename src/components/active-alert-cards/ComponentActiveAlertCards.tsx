import { useAppSelector } from "@/app/hooks"
import { AlertDetails } from "@/utils/types/indexTypes"
import {
    Button,
    Dialog,
    Heading,
    Portal,
    VStack,
    Text,
    Blockquote,
    SimpleGrid,
    Image,
} from "@chakra-ui/react"
import { useState } from "react"

const ComponentActiveAlertCards = () => {
    const allActiveAlertsState = useAppSelector(state => {
        return state.alertDetailsSlice
    })

    const [testing, setTesting] = useState<any>()

    if (
        allActiveAlertsState.data === null ||
        allActiveAlertsState.data.alerts.length === 0
    ) {
        return <></>
    } else {
        return (
            // need to convert to read from file
            <VStack w="full" gap={8} alignItems="center">
                <Heading>Active Alerts</Heading>
                <SimpleGrid gap={8} columns={[2, null, 4]}>
                    {allActiveAlertsState.data.alerts.map(
                        // (alertDetails: AlertDetails) => {
                        //     console.log(alertDetails)
                        (alertDetails: any) => {

                            const imageBlob = new Blob([alertDetails.alert_details_file], { type: 'image/png' }); // or 'image/png'
                            const imageUrl = URL.createObjectURL(imageBlob);
                            if (!imageUrl) {
                                setTesting(imageUrl)
                            }

                            return (
                                <Dialog.Root
                                    key={alertDetails.alert_details.alertDetail_id}
                                    scrollBehavior="inside"
                                    size="xl"
                                    placement="center"
                                    motionPreset="scale"
                                >
                                    <Dialog.Trigger asChild>
                                        <VStack>
                                            <Image
                                                h={["auto", null, null, "30vh"]}
                                                fit="cover"
                                                aspectRatio={1}
                                                bgColor="#FDFDFD"
                                                border="xs"
                                                borderColor={"lightgray"}
                                                shadow="sm"
                                                src={testing}
                                            />
                                            <Heading textTransform="capitalize">
                                                {alertDetails.alertDetail_name}
                                            </Heading>
                                        </VStack>
                                    </Dialog.Trigger>
                                    <Portal>
                                        <Dialog.Backdrop />
                                        <Dialog.Positioner>
                                            <Dialog.Content>
                                                <Dialog.Header>
                                                    <Dialog.Title>Alert Details</Dialog.Title>
                                                </Dialog.Header>
                                                <Dialog.Body>
                                                    <VStack gap={8}>
                                                        {/* <Image
                                                            h={[null, null, null, "75vh"]}
                                                            w="full"
                                                            fit="scale-down"
                                                            src={`data:${imageType};base64,${alertDetails.alertDetail_imageName}`}
                                                        /> */}

                                                        <VStack
                                                            w="full"
                                                            fontSize="medium"
                                                            textTransform="capitalize"
                                                        >
                                                            <Text w="full">alert activated by: </Text>
                                                            <Blockquote.Root
                                                                w="full"
                                                                px={0}
                                                                colorPalette="gray"
                                                            >
                                                                <Blockquote.Content
                                                                    w="full"
                                                                    py={4}
                                                                    px={2}
                                                                    bg="gray.100"
                                                                    fontWeight="semibold"
                                                                >
                                                                    {alertDetails.alert_details.account_id.account_name}
                                                                </Blockquote.Content>
                                                            </Blockquote.Root>
                                                        </VStack>

                                                        <VStack
                                                            w="full"
                                                            fontSize="medium"
                                                            textTransform="capitalize"
                                                        >
                                                            <Text w="full">alert activated at: </Text>
                                                            <Blockquote.Root
                                                                w="full"
                                                                px={0}
                                                                colorPalette="gray"
                                                            >
                                                                <Blockquote.Content
                                                                    w="full"
                                                                    py={4}
                                                                    px={2}
                                                                    bg="gray.100"
                                                                    fontWeight="semibold"
                                                                >
                                                                    {alertDetails.alert_details.alertDetails_startTime}
                                                                </Blockquote.Content>
                                                            </Blockquote.Root>
                                                        </VStack>

                                                        <VStack
                                                            w="full"
                                                            fontSize="medium"
                                                            textTransform="capitalize"
                                                        >
                                                            <Text w="full">persons name: </Text>
                                                            <Blockquote.Root
                                                                w="full"
                                                                px={0}
                                                                colorPalette="gray"
                                                            >
                                                                <Blockquote.Content
                                                                    w="full"
                                                                    py={4}
                                                                    px={2}
                                                                    bg="gray.100"
                                                                    fontWeight="semibold"
                                                                >
                                                                    {alertDetails.alert_details.alertDetail_name}
                                                                </Blockquote.Content>
                                                            </Blockquote.Root>
                                                        </VStack>

                                                        <VStack
                                                            w="full"
                                                            fontSize="medium"
                                                            textTransform="capitalize"
                                                        >
                                                            <Text w="full">Reason for alert: </Text>
                                                            <Blockquote.Root
                                                                w="full"
                                                                px={0}
                                                                colorPalette="gray"
                                                            >
                                                                <Blockquote.Content
                                                                    w="full"
                                                                    py={4}
                                                                    px={2}
                                                                    bg="gray.100"
                                                                    fontWeight="semibold"
                                                                >
                                                                    {alertDetails.alertDetails_alertReason}
                                                                </Blockquote.Content>
                                                            </Blockquote.Root>
                                                        </VStack>
                                                    </VStack>
                                                </Dialog.Body>
                                                <Dialog.Footer>
                                                    <Dialog.ActionTrigger asChild>
                                                        <Button>Close</Button>
                                                    </Dialog.ActionTrigger>
                                                </Dialog.Footer>
                                            </Dialog.Content>
                                        </Dialog.Positioner>
                                    </Portal>
                                </Dialog.Root>
                            )
                        },
                    )}
                </SimpleGrid>
            </VStack>
        )
    }
}

export default ComponentActiveAlertCards
