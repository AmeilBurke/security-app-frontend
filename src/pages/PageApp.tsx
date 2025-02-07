import { useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { toaster, Toaster } from "@/components/ui/toaster"
import { getSocket } from "@/socket"
import { Account, AlertDetails, BannedPerson, Venue } from "@/utils/types/indexTypes"
import { setAlertDetails } from "@/features/alertDetails/alertDetailsSlice"
import { fetchIndividualAccountDetails } from "@/api requests/get/accounts/fetchIndividualAccountDetails"
import { fetchProfileInformationFromJwt } from "@/api requests/get/accounts/fetchProfileInformationFromJwt"
import { setUserAccountDetails } from "@/features/userAccountDetails/userAccountDetailsSlice"
import { utilAxiosErrorToast } from "@/utils/utilAxiosErrorToast"
import axios, { AxiosResponse } from "axios"
import { fetchAllAccountsDetails } from "@/api requests/get/accounts/fetchAllAccountsDetails"
import { setOtherAccountDetails } from "@/features/otherAccountDetails/otherAccountDetailsSlice"
import { fetchAllVenues } from "@/api requests/get/venues/fetchAllVenues"
import { setVenues } from "@/features/venues/venuesSlice"
import { setBannedPeople } from "@/features/bannedPeople/bannedPeopleSlice"
import { fetchAllBannedPeople } from "@/api requests/get/banned-people/fetchAllBannedPeople"

const PageApp = () => {
    const dispatch = useAppDispatch()
    const jwtToken = localStorage.getItem("jwt")
    const socket = getSocket()
    const timestampOfLastAlert = useRef<Date | undefined>(undefined)
    const hasTriedAutoLogIn = useRef<boolean>(false)
    const userAccountDetails = useAppSelector(state => state.userAccountDetailsSlice)
    const allOtherAccountsDetails = useAppSelector(state => state.otherAccountDetailsSlice.other_accounts)
    const allVenues = useAppSelector(state => state.venuesSlice.venues)
    const allBannedPeople = useAppSelector(state => state.bannedPeopleSlice)

    const autoLoginHandler = async () => {
        const fetchProfileInformationFromJwtResult =
            await fetchProfileInformationFromJwt()

        if (axios.isAxiosError(fetchProfileInformationFromJwtResult)) {
            utilAxiosErrorToast(fetchProfileInformationFromJwtResult)
        }

        const fetchIndividualAccountDetailsResult =
            await fetchIndividualAccountDetails(
                (fetchProfileInformationFromJwtResult as AxiosResponse).data.sub,
            )

        if (axios.isAxiosError(fetchIndividualAccountDetailsResult)) {
            utilAxiosErrorToast(fetchIndividualAccountDetailsResult)
        }

        dispatch(
            setUserAccountDetails(
                (fetchIndividualAccountDetailsResult as AxiosResponse).data,
            ),
        )
    }

    const onConnect = () => {
        console.log(`WebSocket ID: ${socket.id}`)

        if (socket.recovered) {
            console.log(`Websocket ID: ${socket.id} was recovered`)
        }
    }

    const onAlertCreate = (data: {
        latestAlert: AlertDetails
        latestAlertTime: string
    }) => {
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
            console.log(
                `timestampOfLastAlert.current: ${timestampOfLastAlert.current <= newAlertTimestamp}`,
            )
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
            autoLoginHandler()
            hasTriedAutoLogIn.current = true
        }
    }, [])

    useEffect(() => {
        if (jwtToken !== null && jwtToken !== "" && !socket.connected) {
            socket.on("connect", onConnect)
            socket.on("onAlertCreate", onAlertCreate)
            // need to add update
            socket.connect()
        }

        return () => {
            if (socket.connected) {
                socket.off("connect", onConnect)
                socket.off("onAlertCreate", onAlertCreate)
                // need to socket.off() update
                socket.disconnect()
            }
        }
    }, [])

    // for testing api calls
    useEffect(() => {
        const fetchAllOtherAccountsDetailsHandler = async () => {
            const fetchAllAccountsDetailsResult = await fetchAllAccountsDetails()
            if (axios.isAxiosError(fetchAllAccountsDetailsResult)) {
                utilAxiosErrorToast(fetchAllAccountsDetailsResult)
            } else {
                const resultsWithoutUserAccount = (fetchAllAccountsDetailsResult.data as Account[]).filter(account => account.account_id !== userAccountDetails.account_id)
                dispatch(setOtherAccountDetails({ other_accounts: resultsWithoutUserAccount }))
            }
        }

        const fetchAllVenuesHandler = async () => {
            const fetchAllVenuesResult = await fetchAllVenues()
            if (axios.isAxiosError(fetchAllVenuesResult)) {
                utilAxiosErrorToast(fetchAllVenuesResult)
            } else {
                dispatch(setVenues({ venues: fetchAllVenuesResult.data as Venue[] }))
            }
        }

        const fetchAllBannedPeopleHandler = async () => {
            const fetchAllBannedPeopleResult = await fetchAllBannedPeople()
            console.log(fetchAllBannedPeopleResult)
            
            if (axios.isAxiosError(fetchAllBannedPeopleResult)) {
                utilAxiosErrorToast(fetchAllBannedPeopleResult)
            } else {
                dispatch(setBannedPeople({ active_bans: fetchAllBannedPeopleResult.data.active_bans as BannedPerson[], non_active_bans: fetchAllBannedPeopleResult.data.non_active_bans as BannedPerson[] }))
            }
        }

        if (userAccountDetails.account_id !== -1 && allOtherAccountsDetails[0].account_id === -1) {
            fetchAllOtherAccountsDetailsHandler()
        }

        if (userAccountDetails.account_id !== -1 && allVenues[0].venue_id === -1) {
            fetchAllVenuesHandler()
        }

        if (userAccountDetails.account_id !== -1 && allBannedPeople.active_bans[0].bannedPerson_id === -1) {
            fetchAllBannedPeopleHandler()
        }

    }, [userAccountDetails])

    return (
        <>
            <Toaster />
            {/* need to add navbar here */}
        </>
    )
}

export default PageApp
