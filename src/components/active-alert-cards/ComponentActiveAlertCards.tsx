import { useAppSelector } from "@/app/hooks"
import { AlertDetails } from "@/utils/types/indexTypes"
import { utilGetFileTypeFromBase64String } from "@/utils/utilGetFileTypeFromBase64String"
import { VStack, Heading, SimpleGrid, Image } from "@chakra-ui/react"
import { Link as ReactRouterLink } from "react-router"

const ComponentActiveAlertCards = () => {
    const allActiveAlertsState = useAppSelector(state => {
        return state.alertDetailsSlice
    })

    if (allActiveAlertsState.data === null || allActiveAlertsState.data.alerts.length === 0) {
        return <></>
    } else {
        return (
            <VStack w="full" gap={8} alignItems="center">
                <Heading w="full">Active Alerts</Heading>
                <SimpleGrid gap={8} columns={[2, null, 6]}>
                    {allActiveAlertsState.data.alerts.map((alertDetails: AlertDetails) => {
                        const imageType = utilGetFileTypeFromBase64String(
                            alertDetails.alertDetail_imageName,
                        )

                        return (
                            <ReactRouterLink
                                to={`alert/${alertDetails.alertDetail_id}`}
                                key={alertDetails.alertDetail_id}
                            >
                                <Image
                                    h={[null, null, null, '30vh']}
                                    fit="cover"
                                    aspectRatio={1}
                                    bgColor="#FDFDFD"
                                    border="xs"
                                    borderColor={"lightgray"}
                                    shadow="sm"
                                    src={`data:${imageType};base64,${alertDetails.alertDetail_imageName}`}
                                />
                                <Heading textTransform="capitalize">{alertDetails.alertDetail_name}</Heading>
                            </ReactRouterLink>
                        )
                    })}
                </SimpleGrid>
            </VStack>
        )
    }
}

export default ComponentActiveAlertCards
