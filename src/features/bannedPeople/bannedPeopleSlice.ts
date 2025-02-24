import { fetchAllBannedPeople } from "@/api-requests/get/banned-people/fetchAllBannedPeople"
import { BannedPerson } from "@/utils/types/indexTypes"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

export const fetchAllBannedPeopleData = createAsyncThunk<any>(
  "bannedPeople/fetchAllBannedPeopleData",
  async () => {
    const result = await fetchAllBannedPeople()

    if (axios.isAxiosError(result)) {
      return result
    } else {
      return result.data
    }
  },
)

export interface allBannedPeopleState {
  data: {
    active_bans: BannedPerson[]
    non_active_bans: BannedPerson[]
  } | null
  error: string | null
  isLoading: boolean
}

const initialState: allBannedPeopleState = {
  data: null,
  error: null,
  isLoading: false,
}

export const bannedPeopleSlice = createSlice({
  name: "banned-people",
  initialState,
  reducers: {
    resetBannedPeopleState: state => (state = initialState),
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllBannedPeopleData.pending, state => {
        state.isLoading = true
      })
      .addCase(fetchAllBannedPeopleData.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload
      })
      .addCase(fetchAllBannedPeopleData.rejected, (state, action) => {
        state.isLoading = false
        state.error =
          action.error.message ||
          "There was an error getting the list of banned people"
      })
  },
})

export const { resetBannedPeopleState } = bannedPeopleSlice.actions
export default bannedPeopleSlice.reducer
