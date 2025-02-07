import { Venue } from "@/utils/types/indexTypes"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: { venues: Venue[] } = {
  venues: [
    {
      venue_id: -1,
      venue_name: "",
      venue_imagePath: "",
    },
  ],
}

export const venuesSlice = createSlice({
  name: "venues",
  initialState,
  reducers: {
    getVenues: state => {
      return state
    },
    setVenues: (state, action: PayloadAction<{ venues: Venue[] }>) => {
      state.venues = action.payload.venues
    },
  },
})

export const { getVenues, setVenues } = venuesSlice.actions
export default venuesSlice.reducer
