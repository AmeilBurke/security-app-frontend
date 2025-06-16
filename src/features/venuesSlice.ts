import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { Venue } from "@/utils/types"
import { getAllVenues } from "@/api-requests/venues/getAllVenues"
import { isPrismaResultError } from "@/utils/types"

export const fetchVenues = createAsyncThunk<Venue[], void, { rejectValue: string }>(
  "venues/fetchVenues",
  async (_, { rejectWithValue }) => {

    const result = await getAllVenues()
    
    if (isPrismaResultError(result)) {
      return rejectWithValue(result.error_message || "Failed to fetch venues")
    }
    return result
  }
)


export interface VenueState {
  data: Venue[] | null
  error: string | null
  isLoading: boolean
}

const initialState: VenueState = {
  data: null,
  isLoading: false,
  error: null,
}

export const venuesSlice = createSlice({
  name: "venues",
  initialState,
  reducers: {
    resetVenueState: state => {
      state.data = null
      state.isLoading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVenues.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchVenues.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload
        state.error = null
      })
      .addCase(fetchVenues.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? "Failed to fetch venues"
      })
  }
})

export const { resetVenueState } = venuesSlice.actions
export default venuesSlice.reducer

