import { clearJwt } from '@/api-requests/authentication/clearJwt'
import { getAccountDetailsFromJwt } from '@/api-requests/authentication/getAccountDetailsFromJwt'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import ComponentNavbar from '@/components/navbar/ComponentNavbar'
import { toaster } from '@/components/ui/toaster'
import { resetUserAccountState, setUserAccountState } from '@/features/userAccountDetailsSlice'
import { getSocket } from '@/socket'
import { isPrismaResultError } from '@/utils/types'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import dayjs, { Dayjs } from 'dayjs';
import { fetchVenues } from '@/features/venuesSlice'
import { fetchAllBannedPeople } from '@/features/bannedPeopleDetailsSlice'

const PageApp = () => {
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true)
    const [timeOfLastAlert, setTimeOfLastAlert] = useState<Dayjs | undefined>()
    const userAccountDetails = useAppSelector(state => state.userAccountDetailsSlice)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const socket = getSocket()

    const autoLoginHandler = async () => {
        const result = await getAccountDetailsFromJwt()
        if (isPrismaResultError(result)) {
            navigate("/sign-in")
            return
        }
        dispatch(setUserAccountState(result))
    }

    // auto login handler
    useEffect(() => {
        if (isInitialLoad) {
            autoLoginHandler()
            setIsInitialLoad(false)
        }

    }, [isInitialLoad])

    // websockets
    useEffect(() => {

        const socketConnect = () => {
            console.log(socket.id)
        }

        const socketMissingJwt = async () => {
            toaster.create({
                title: 'Connection Error',
                description: 'Please sign in again',
                type: 'error'
            })

            dispatch(resetUserAccountState())
            await clearJwt()
            navigate("/sign-in")
        }

        const socketAlertDetailCreated = (event: { message: string }) => {
            // check if time is after last alert
            const timeNow = dayjs()

            if (timeOfLastAlert === undefined || timeOfLastAlert.isBefore(timeNow)) {
                toaster.create({
                    title: 'Alert Uploaded',
                    description: event.message,
                    type: 'info'
                })
                setTimeOfLastAlert(timeNow)
            }
        }

        const banToastNotificationhandler = (event: { message: string }) => {
            // check if time is after last alert
            const timeNow = dayjs()
            console.log(timeNow)

            if (timeOfLastAlert === undefined || (timeOfLastAlert.isBefore(timeNow) && !timeOfLastAlert.isSame(timeNow))) {
                toaster.create({
                    title: 'Ban Uploaded',
                    description: event.message,
                    type: 'info'
                })
                setTimeOfLastAlert(timeNow)
            }
        }

        if (userAccountDetails.data !== null && socket.disconnected) {
            socket.connect()
            socket.on('connect', socketConnect)
            socket.on('missing_jwt', socketMissingJwt)
            socket.on('banForNewPersonCreated', banToastNotificationhandler)
            socket.on('banForExistingPersonCreated', banToastNotificationhandler)
            socket.on('alertCreated', banToastNotificationhandler)
        }

        return () => {
            socket.off('connect', socketConnect)
            socket.off('missing_jwt', socketMissingJwt)
            socket.off('banForNewPersonCreated', banToastNotificationhandler)
            socket.off('banForExistingPersonCreated', banToastNotificationhandler)
            socket.off('alertCreated', banToastNotificationhandler)
        }

    }, [userAccountDetails.data, socket])

    // fetches for state from api
    useEffect(() => {

        if (userAccountDetails.data !== null) {
            dispatch(fetchVenues())
            // might need to fetch different banned people filters based off page the user is on
            // dispatch(fetchAllBannedPeople())
        }

    }, [userAccountDetails])


    return (
        <>
            {
                userAccountDetails.data === null
                    ? null
                    : <ComponentNavbar />
            }
        </>
    )
}

export default PageApp