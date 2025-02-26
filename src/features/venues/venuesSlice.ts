import { fetchAllVenues } from "@/api-requests/get/venues/fetchAllVenues"
import { Venue } from "@/utils/types/indexTypes"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

export const fetchAllVenuesData = createAsyncThunk<any>(
  "venue/fetchAllVenuesData",
  async () => {
    const result = await fetchAllVenues()

    if (axios.isAxiosError(result)) {
      return result
    } else {
      return result.data
    }
  },
)

export interface VenuesState {
  data: { all_venues: Venue[] | null }
  error: string | null
  isLoading: boolean
}

const initialState: VenuesState = {
  data: { all_venues: null },
  error: null,
  isLoading: true,
}

export const venuesSlice = createSlice({
  name: "venues",
  initialState,
  reducers: {
    resetVenuesState: state => (state = initialState),
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllVenuesData.pending, state => {
        state.isLoading = true
      })
      .addCase(fetchAllVenuesData.fulfilled, (state, action) => {
        state.isLoading = false
        state.data.all_venues = action.payload
      })
      .addCase(fetchAllVenuesData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "There was an error getting your account details"
      })
  },
})

export const { resetVenuesState } = venuesSlice.actions
export default venuesSlice.reducer
