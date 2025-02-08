import { AlertDetails } from "@/utils/types/indexTypes"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: { alerts: AlertDetails[] } = {
  alerts: [
    {
      alertDetail_id: -1,
      alertDetail_bannedPersonId: null,
      alertDetail_name: "",
      alertDetail_imageName: "",
      alertDetails_alertReason: "",
      alertDetails_startTime: "",
      alertDetails_alertUploadedBy: -1,
    },
  ],
}

export const alertDetailsSlice = createSlice({
  name: "alert-details",
  initialState,
  reducers: {
    getAlertDetails: state => {
      return state
    },
    setAlertDetails: (
      state,
      action: PayloadAction<{ alerts: AlertDetails[] }>,
    ) => {
      if (state.alerts[0].alertDetail_id === -1) {
        state.alerts = action.payload.alerts
      } else {
        state.alerts = [...state.alerts, ...action.payload.alerts]
      }
    },
  },
})

export const { getAlertDetails, setAlertDetails } = alertDetailsSlice.actions
export default alertDetailsSlice.reducer
