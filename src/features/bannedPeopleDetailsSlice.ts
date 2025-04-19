import { BannedPerson } from "@/utils/types"
import { createSlice } from "@reduxjs/toolkit"

export interface BannedPeopleState {
  data: BannedPerson[] | null
  error: string | null
  isLoading: boolean
}

const initialState: BannedPeopleState = {
  data: null,
  isLoading: false,
  error: null,
}

export const bannedPeopleDetailsSlice = createSlice({
  name: "banned-people-details",
  initialState,
  reducers: {
    resetBannedPeopleState: state => (state = initialState),
    setBannedPeopleState: (state, action) => {
      state.data = action.payload
    },
  },
})

export const { resetBannedPeopleState, setBannedPeopleState } = bannedPeopleDetailsSlice.actions
export default bannedPeopleDetailsSlice.reducer
