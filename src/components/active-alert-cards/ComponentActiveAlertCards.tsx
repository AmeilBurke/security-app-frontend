import { useAppSelector } from "@/app/hooks"
import { AlertDetails } from "@/utils/types/indexTypes"
import { VStack, Heading } from "@chakra-ui/react"

const ComponentActiveAlertCards = () => {
    const allActiveAlertsState = useAppSelector(state => {
        return state.alertDetailsSlice
    })

    if (allActiveAlertsState.data.alerts === null) {
        return <></>
    } else {
        return (
            <VStack>
                <Heading>Active Alerts</Heading>
                {allActiveAlertsState.data.alerts.map((alertDetails: AlertDetails) => {
                    return <Heading key={alertDetails.alertDetail_id} >{alertDetails.alertDetail_name}</Heading>
                })}
            </VStack>
        )
    }
}

export default ComponentActiveAlertCards
