// router.tsx
import { createBrowserRouter } from "react-router"
import PageSignIn from "./pages/PageSignIn"
import PageDashboard from "./pages/PageDashboard"
import PageCreateBan from "./pages/PageCreateBan"
import PageCreateAlert from "./pages/PageCreateAlert"
import PageActiveAlertDetail from "./pages/PageActiveAlertDetail"
import ComponentContainer from "./components/container/ComponentContainer"
import PageApp from "./pages/PageApp"
import { getAllIndividualAlert } from "./api-requests/alert-details/getIndividualAlert"
import { Toaster } from "@/components/ui/toaster"
import { getAllActiveAlerts } from "./api-requests/alert-details/getAllActiveAlerts"
import { getAllNonPendingBan } from "./api-requests/banned-people/getAllNonPendingBan"
import { ScrollToPageTop } from "./utils/helper-functions"

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
                index: true, element: <PageDashboard />, loader: async () => {
                    return await getAllActiveAlerts()
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
        ],
    },
])

export default router
