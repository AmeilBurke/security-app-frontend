import { useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { getSocket } from "@/socket"
import { Account, AlertDetails } from "@/utils/types/indexTypes"
import axios, { AxiosResponse } from "axios"
import { utilAxiosErrorToast } from "@/utils/utilAxiosErrorToast"
import { fetchProfileInformationFromJwt } from "@/api-requests/get/accounts/fetchProfileInformationFromJwt"
import { fetchIndividualAccountDetails } from "@/api-requests/get/accounts/fetchIndividualAccountDetails"
import { fetchAllVenues } from "@/api-requests/get/venues/fetchAllVenues"
import { fetchAllAccountsDetails } from "@/api-requests/get/accounts/fetchAllAccountsDetails"
import { fetchAllBannedPeople } from "@/api-requests/get/banned-people/fetchAllBannedPeople"
import { fetchAllAlertDetails } from "@/api-requests/get/alertDetails/fetchAllAlertDetails"
import { toaster, Toaster } from "@/components/ui/toaster"
import {
    isPrismaClientKnownRequestError,
    signOutHandler,
} from "@/utils/helper-functions/indexHelperFunctions"
import ComponentNavbar from "@/components/navbar/ComponentNavbar"
import { fetchOtherAccountData } from "@/features/otherAccountDetails/otherAccountDetailsSlice"
import { fetchUserAccountData } from "@/features/userAccountDetails/userAccountDetailsSlice"
import { fetchAllVenuesData } from "@/features/venues/venuesSlice"
import { fetchAllBannedPeopleData } from "@/features/bannedPeople/bannedPeopleSlice"
import { fetchAlertDetailsData } from "@/features/alertDetails/alertDetailsSlice"

const PageApp = () => {
    const dispatch = useAppDispatch()
    const jwtToken = localStorage.getItem("jwt")
    const socket = getSocket()
    const hasTriedAutoLogIn = useRef<boolean>(false)
    const userAccountState = useAppSelector(state => state.userAccountDetailsSlice)
    const otherAccountState = useAppSelector(state => state.otherAccountDetailsSlice)
    const allVenuesState = useAppSelector(state => state.venuesSlice)
    const allBannedPeopleState = useAppSelector(state => state.bannedPeopleSlice)
    const allAlertDetailsState = useAppSelector(state => state.alertDetailsSlice)
    const [hasDisplayedLatestAlert, setHasDisplayedLatestAlert] = useState<boolean>(false)

    const autoLoginHandler = async () => {
        const fetchProfileInformationFromJwtResult =
            await fetchProfileInformationFromJwt()

        if (axios.isAxiosError(fetchProfileInformationFromJwtResult)) {
            utilAxiosErrorToast(fetchProfileInformationFromJwtResult)
            signOutHandler()
        } else if (
            isPrismaClientKnownRequestError(fetchProfileInformationFromJwtResult)
        ) {
            utilAxiosErrorToast(fetchProfileInformationFromJwtResult)
            return
        }
        const fetchIndividualAccountDetailsResult =
            await fetchIndividualAccountDetails(
                (fetchProfileInformationFromJwtResult as AxiosResponse).data.sub,
            )

        if (axios.isAxiosError(fetchIndividualAccountDetailsResult)) {
            utilAxiosErrorToast(fetchIndividualAccountDetailsResult)
            return
        } else if (
            isPrismaClientKnownRequestError(fetchIndividualAccountDetailsResult)
        ) {
            utilAxiosErrorToast(fetchIndividualAccountDetailsResult)
            return
        }

        dispatch(
            fetchUserAccountData(fetchIndividualAccountDetailsResult.data.account_id),
        )
    }

    // const onAlertCreate = (data: {
    //     latestAlert: AlertDetails
    //     latestAlertTime: string
    // }) => {
    //     const [day, month, year] = data.latestAlertTime
    //         .split("T")[0]
    //         .split("/")
    //         .map(stringToConvert => Number(stringToConvert))
    //     const [hours, minutes, seconds, milliseconds] = data.latestAlertTime
    //         .split("T")[1]
    //         .split(":")
    //         .map(stringToConvert => Number(stringToConvert))

    //     const newAlertTimestamp = new Date(
    //         year,
    //         month - 1,
    //         day,
    //         hours,
    //         minutes,
    //         seconds,
    //         milliseconds,
    //     )

    //     if (timestampOfLastAlert.current !== undefined) {
    //         console.log(
    //             `timestampOfLastAlert.current: ${timestampOfLastAlert.current <= newAlertTimestamp}`,
    //         )
    //     }

    //     if (
    //         timestampOfLastAlert.current === undefined ||
    //         timestampOfLastAlert.current < newAlertTimestamp
    //     ) {
    //         timestampOfLastAlert.current = newAlertTimestamp
    //         dispatch(setAlertDetails({ alerts: [data.latestAlert] }))

    //         toaster.create({
    //             title: "New Alert!",
    //             description: "A new alert has been uploaded",
    //         })
    //     }
    // }

    // auto login
    useEffect(() => {
        if (jwtToken !== null && jwtToken !== "" && !hasTriedAutoLogIn.current) {
            autoLoginHandler()
            hasTriedAutoLogIn.current = true
        }
    }, [])

    // websocket connection
    useEffect(() => {
        const onConnect = () => {
            console.log(`Websocket ID: ${socket.id}`)

            if (socket.recovered) {
                console.log(`Websocket ID: ${socket.id} was recovered`)
            }
        }

        const onBanCreate = (result: {
            allAlerts: {
                alertDetail: AlertDetails & {
                    account_id: {
                        account_name: string
                    }
                }
            }[]
        }) => {

            if (hasDisplayedLatestAlert) {
                setHasDisplayedLatestAlert(false)
                return
            }

            toaster.create({
                title: 'New Alert',
                description: `${result.allAlerts[result.allAlerts.length - 1].alertDetail.account_id.account_name} has uploaded a new alert`,
                type: 'info'
            })

            dispatch(fetchAlertDetailsData())

            setHasDisplayedLatestAlert(true)
        }

        if (jwtToken !== null && jwtToken !== "" && !socket.connected) {
            socket.on("connect", onConnect)
            socket.on("onBanCreate", result => onBanCreate(result))
            // socket.on("onAlertCreate", onAlertCreate)
            // need to add update
            socket.connect()
        }

        return () => {
            if (socket.connected) {
                socket.off("connect", onConnect)
                // socket.off("onAlertCreate", onAlertCreate)
                // need to socket.off() update
                socket.disconnect()
            }
        }
    }, [])

    // api calls
    useEffect(() => {
        const fetchAllOtherAccountsDetailsHandler = async () => {
            const fetchAllAccountsDetailsResult = await fetchAllAccountsDetails()
            if (axios.isAxiosError(fetchAllAccountsDetailsResult)) {
                utilAxiosErrorToast(fetchAllAccountsDetailsResult)
            } else if (
                isPrismaClientKnownRequestError(fetchAllAccountsDetailsResult)
            ) {
                utilAxiosErrorToast(fetchAllAccountsDetailsResult)
                return
            } else {
                const resultsWithoutUserAccount = (
                    fetchAllAccountsDetailsResult.data as Account[]
                ).filter(
                    account => account.account_id !== userAccountState.data?.account_id,
                )
                dispatch(fetchOtherAccountData())
            }
        }

        const fetchAllVenuesHandler = async () => {
            const fetchAllVenuesResult = await fetchAllVenues()
            if (axios.isAxiosError(fetchAllVenuesResult)) {
                utilAxiosErrorToast(fetchAllVenuesResult)
            } else if (isPrismaClientKnownRequestError(fetchAllVenuesResult)) {
                utilAxiosErrorToast(fetchAllVenuesResult)
                return
            } else {
                dispatch(fetchAllVenuesData())
            }
        }

        const fetchAllBannedPeopleHandler = async () => {
            const fetchAllBannedPeopleResult = await fetchAllBannedPeople()

            if (axios.isAxiosError(fetchAllBannedPeopleResult)) {
                utilAxiosErrorToast(fetchAllBannedPeopleResult)
            } else if (isPrismaClientKnownRequestError(fetchAllBannedPeopleResult)) {
                utilAxiosErrorToast(fetchAllBannedPeopleResult)
                return
            } else {
                dispatch(fetchAllBannedPeopleData())
            }
        }

        const fetchAllAlertDetailsHandler = async () => {
            const fetchAllAlertDetailsResult = await fetchAllAlertDetails()

            if (axios.isAxiosError(fetchAllAlertDetailsResult)) {
                utilAxiosErrorToast(fetchAllAlertDetailsResult)
            } else if (isPrismaClientKnownRequestError(fetchAllAlertDetailsResult)) {
                utilAxiosErrorToast(fetchAllAlertDetailsResult)
                return
            } else {
                dispatch(fetchAlertDetailsData())
            }
        }

        if (userAccountState.data !== null) {
            if (otherAccountState.data.other_accounts === null) {
                fetchAllOtherAccountsDetailsHandler()
            }

            if (allVenuesState.data.all_venues === null) {
                fetchAllVenuesHandler()
            }

            if (allBannedPeopleState.data === null) {
                fetchAllBannedPeopleHandler()
            }

            if (allAlertDetailsState.data === null) {
                fetchAllAlertDetailsHandler()
            }
        }
    }, [userAccountState])

    return (
        <>
            <Toaster />
            {userAccountState.data !== null ? <ComponentNavbar /> : null}
        </>
    )
}

export default PageApp
