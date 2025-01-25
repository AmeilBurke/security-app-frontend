import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface venuesSlice {
  venues: { venue_id: number; venue_name: string; venue_imagePath: string }[]
}

const initialState: venuesSlice = {
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
    setVenues: (state, action: PayloadAction<venuesSlice>) => {
      state.venues = action.payload.venues
    },
  },
})

export const { getVenues, setVenues } = venuesSlice.actions
export default venuesSlice.reducer
