import { useEffect, useRef } from "react"
import { getFullAccountDetails } from "@/api-requests/account/getFullAccountDetails"
import { getJwtDetails } from "@/api-requests/account/getJwtDetails"
import { setAccountDetails } from "@/features/accountDetails/accountDetailsSlice"
import { useAppDispatch } from "@/app/hooks"
import { toaster, Toaster } from "@/components/ui/toaster"
import { getSocket } from "@/socket"
import { getJwtFromLocalStorage } from "@/utils/getJwtFromLocalStorage"
import { AlertDetails } from "@/utils/types/indexTypes"
import { setAlertDetails } from "@/features/alertDetails/alertDetailsSlice"
import { getAllAccounts } from "@/api-requests/account/getAllAccounts"
import { getAllBannedPeople } from "@/api-requests/banned-people/getAllBannedPeople"
import { getBannedPersonById } from "@/api-requests/banned-people/getBannedPersonById"
import { getAllBannedPeopleByVenueId } from "@/api-requests/venues/getAllBannedPeopleByVenueId"
import { getAllManagersForOneVenue } from "@/api-requests/venues/getAllManagersForOneVenue"

const PageApp = () => {
    const dispatch = useAppDispatch()
    const jwtToken = getJwtFromLocalStorage()
    const socket = getSocket()
    // const allAlertDetails = useAppSelector(state => state.alertDetailsSlice.alerts)
    const timestampOfLastAlert = useRef<Date | undefined>(undefined)
    const hasTriedAutoLogIn = useRef<boolean>(false)
    const wasAutoLoginSuccessful = useRef<boolean>(false)
    const hasSocketId = useRef<boolean>(false)

    const renewJwtToken = async (jwtToken: string) => {
        const jwtProfileResult = await getJwtDetails(jwtToken)
        if (jwtProfileResult === "error" || jwtProfileResult === 401) {
            wasAutoLoginSuccessful.current = false
            localStorage.removeItem('jwt')
            return null
        }
        const fullProfileResult = await getFullAccountDetails(
            jwtToken,
            jwtProfileResult.sub,
        )
        dispatch(setAccountDetails(fullProfileResult))
        wasAutoLoginSuccessful.current = true
    }

    const onConnect = () => {
        console.log(`WebSocket ID: ${socket.id}`)
        hasSocketId.current = true

        if (socket.recovered) {
            console.log(`Websocket ID: ${socket.id} was recovered`)
        }
    }

    // need to double check this
    const onAlertCreate = (data: {
        latestAlert: AlertDetails
        latestAlertTime: string
    }) => {
        // console.log(data)
        const [day, month, year] = data.latestAlertTime
            .split("T")[0]
            .split("/")
            .map(stringToConvert => Number(stringToConvert))
        const [hours, minutes, seconds, milliseconds] = data.latestAlertTime
            .split("T")[1]
            .split(":")
            .map(stringToConvert => Number(stringToConvert))

        const newAlertTimestamp = new Date(
            year,
            month - 1,
            day,
            hours,
            minutes,
            seconds,
            milliseconds,
        )

        if (timestampOfLastAlert.current !== undefined) {
            console.log(timestampOfLastAlert.current <= newAlertTimestamp)
        }

        if (
            timestampOfLastAlert.current === undefined ||
            timestampOfLastAlert.current < newAlertTimestamp
        ) {
            timestampOfLastAlert.current = newAlertTimestamp
            dispatch(setAlertDetails({ alerts: [data.latestAlert] }))

            toaster.create({
                title: "New Alert!",
                description: "A new alert has been uploaded",
            })
        }
    }

    useEffect(() => {
        if (jwtToken !== null && jwtToken !== "" && !hasTriedAutoLogIn.current) {
            renewJwtToken(jwtToken)
            hasTriedAutoLogIn.current = true
        }
    }, [])

    useEffect(() => {
        console.log(hasSocketId.current)

        if (jwtToken !== null && jwtToken !== "" && !hasSocketId.current && !socket.connected) {
            socket.on("connect", onConnect)
            socket.on("onAlertCreate", onAlertCreate)
            // need to add update
            socket.connect()
        }

        return () => {
            if (socket.connected && hasSocketId.current === true) {
                socket.off("connect", onConnect)
                socket.off("onAlertCreate", onAlertCreate)
                // need to socket.off() update
                socket.disconnect()
            }
        }
    }, [])

    // for testing api calls
    useEffect(() => {
        // const getAllAccountsHandler = async () => {
        //     if (jwtToken !== null && jwtToken !== '') {
        //         const allAccounts = await getAllAccounts(jwtToken)
        //         console.log(allAccounts)
        //     }
        // }

        // const getAllBannedPeopleHandler = async () => {
        //     if (jwtToken !== null && jwtToken !== '') {
        //         const allBannedPeople = await getAllBannedPeople(jwtToken)
        //         console.log(allBannedPeople)
        //     }
        // }

        // const getBannedPersonByIdHandler = async () => {
        //     if (jwtToken !== null && jwtToken !== '') {
        //         const bannedPerson = await getBannedPersonById(jwtToken, 1)
        //         console.log(bannedPerson)
        //     }
        // }

        // const getAllBannedPeopleByVenueIdHandler = async () => {
        //     if (jwtToken !== null && jwtToken !== '') {
        //         const bannedPeople = await getAllBannedPeopleByVenueId(jwtToken, 1)
        //         console.log(bannedPeople)
        //     }
        // }

        // const getAllManagersForOneVenueHandler = async () => {
        //     if (jwtToken !== null && jwtToken !== '') {
        //         const bannedPeople = await getAllManagersForOneVenue(jwtToken, 1)
        //         console.log(bannedPeople)
        //     }
        // }

        // getAllAccountsHandler()
        // getAllBannedPeopleHandler()
        // getBannedPersonByIdHandler()
        // getAllBannedPeopleByVenueIdHandler()
        // getAllManagersForOneVenueHandler()
    }, [])

    return (
        <>
            <Toaster />
            {/* need to add navbar here */}
        </>
    )
}

export default PageApp
