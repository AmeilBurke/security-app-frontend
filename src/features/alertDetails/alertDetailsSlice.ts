import { fetchAllAlertDetails } from "@/api-requests/get/alertDetails/fetchAllAlertDetails"
import { AlertDetails } from "@/utils/types/indexTypes"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

export const fetchAlertDetailsData = createAsyncThunk<any>(
  "account/fetchAlertDetailsData",
  async () => {
    const result = await fetchAllAlertDetails()

    if (axios.isAxiosError(result)) {
      return result
    } else {
      return result.data
    }
  },
)

export interface AlertDetailsState {
  data: {
    alerts: AlertDetails[] & { account_id: { account_name: string } }
  } | null
  error: string | null
  isLoading: boolean
}

const initialState: AlertDetailsState = {
  data: null,
  error: null,
  isLoading: false,
}

export const alertDetailsSlice = createSlice({
  name: "alert-details",
  initialState,
  reducers: {
    resetAlertDetailsState: state => (state = initialState),
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAlertDetailsData.pending, state => {
        state.isLoading = true
      })
      .addCase(fetchAlertDetailsData.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = { alerts: action.payload }
      })
      .addCase(fetchAlertDetailsData.rejected, (state, action) => {
        state.isLoading = false
        state.error =
          action.error.message ||
          "There was an error getting alert details details"
      })
  },
})

export const { resetAlertDetailsState } = alertDetailsSlice.actions
export default alertDetailsSlice.reducer
