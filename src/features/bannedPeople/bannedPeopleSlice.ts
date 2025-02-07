import { BannedPerson } from "@/utils/types/indexTypes"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: {
  active_bans: BannedPerson[]
  non_active_bans: BannedPerson[]
} = {
  active_bans: [
    {
      bannedPerson_id: -1,
      bannedPerson_name: "",
      bannedPerson_imageName: "",
    },
  ],
  non_active_bans: [
    {
      bannedPerson_id: -1,
      bannedPerson_name: "",
      bannedPerson_imageName: "",
    },
  ],
}

export const bannedPeopleSlice = createSlice({
  name: "banned-people",
  initialState,
  reducers: {
    getBannedPeople: state => {
      return state
    },
    setBannedPeople: (
      state,
      action: PayloadAction<{
        active_bans: BannedPerson[]
        non_active_bans: BannedPerson[]
      }>,
    ) => {
      state.active_bans = action.payload.active_bans
      state.non_active_bans = action.payload.non_active_bans
    },
  },
})

export const { getBannedPeople, setBannedPeople } = bannedPeopleSlice.actions
export default bannedPeopleSlice.reducer
