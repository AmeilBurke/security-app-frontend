// router.tsx
import { createBrowserRouter } from "react-router"
import PageSignIn from "./pages/PageSignIn"
import PageDashboard from "./pages/PageDashboard"
import PageCreateBan from "./pages/PageCreateBan"
import PageCreateAlert from "./pages/PageCreateAlert"
import PageActiveAlertDetail from "./pages/PageActiveAlertDetail"
import PageFallback from "./pages/PageFallback"
import ComponentContainer from "./components/container/ComponentContainer"
import PageApp from "./pages/PageApp"
import { getAllIndividualAlert } from "./api-requests/alert-details/getIndividualAlert"
import { Toaster } from "@/components/ui/toaster"
import { getAllActiveAlerts } from "./api-requests/alert-details/getAllActiveAlerts"
import { getAllNonPendingBan } from "./api-requests/banned-people/getAllNonPendingBan"
import { ScrollToPageTop } from "./utils/helper-functions"
import { getAllVenues } from "./api-requests/venues/getAllVenues"
import { isPrismaResultError } from "./utils/types"
import PageVenue from "./pages/PageVenue"
import { getAllBannedFromOneVenue } from "./api-requests/banned-people/getAllBannedFromOneVenue"
import { getOneBanned } from "./api-requests/banned-people/getOneBanned"
import PageBannedPerson from "./pages/PageBannedPerson"

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ComponentContainer>
                <PageApp />
                <Toaster />
                <ScrollToPageTop />
            </ComponentContainer>
        ),
        children: [
            {
                index: true, element: <PageDashboard />, hydrateFallbackElement: <PageFallback />, loader: async () => {
                    const [alertDetails, venues] = await Promise.all([
                        getAllActiveAlerts(),
                        getAllVenues(),
                    ])

                    return { alertDetails, venues }
                },
            },
            { path: "sign-in", element: <PageSignIn /> },
            {
                path: "create-alert", element: <PageCreateAlert />, loader: async () => {
                    return await getAllNonPendingBan()
                }
            },
            {
                path: "create-ban", element: <PageCreateBan />, loader: async () => {
                    return await getAllNonPendingBan()
                }
            },
            {
                path: "active-alert/:alertId",
                element: <PageActiveAlertDetail />,
                loader: async ({ params }) => {
                    return await getAllIndividualAlert(Number(params.alertId))
                },
            },
            {
                path: "venue/:venueId",
                element: <PageVenue />,
                loader: async ({ params }) => {
                    return {
                        peopleBannedFromVenue: await getAllBannedFromOneVenue(Number(params.venueId)),
                        venueId: Number(params.venueId)
                    }
                },
            },
            {
                path: "banned-person/:bannedPersonId",
                element: <PageBannedPerson />,
                loader: async ({ params }) => {
                    return await getOneBanned(Number(params.bannedPersonId))
                },
            },
        ],
    },
])

export default router
