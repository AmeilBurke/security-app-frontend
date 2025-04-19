import { Venue } from "@/utils/types"
import { createSlice } from "@reduxjs/toolkit"

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
    resetVenueState: state => (state = initialState),
    setVenueState: (state, action) => {
      state.data = action.payload
    },
  },
})

export const { resetVenueState, setVenueState } = venuesSlice.actions
export default venuesSlice.reducer
