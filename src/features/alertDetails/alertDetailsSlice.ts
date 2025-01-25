import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface alertDetailState {
  alerts: {
    alertDetail_id: number
    alertDetail_bannedPersonId: number | null
    alertDetail_name: string
    alertDetail_imageName: string
    alertDetails_alertReason: string
    alertDetails_startTime: string
    alertDetails_alertUploadedBy: number
  }[]
}

const initialState: alertDetailState = {
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
    setAlertDetails: (state, action: PayloadAction<alertDetailState>) => {
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
