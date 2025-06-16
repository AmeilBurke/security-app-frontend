import { getAllBanned } from "@/api-requests/banned-people/getAllBanned"
import { BannedPerson, isPrismaResultError } from "@/utils/types"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export interface BannedPeopleState {
  data: BannedPerson[] | null
  error: string | null
  isLoading: boolean
}

export const fetchAllBannedPeople = createAsyncThunk<
  BannedPerson[],
  void,
  { rejectValue: string }
>("bannedPeople/fetchAllBannedPeople", async (_, { rejectWithValue }) => {
  const result = await getAllBanned()

  if (isPrismaResultError(result)) {
    return rejectWithValue(result.error_message || "Failed to fetch venues")
  }
  return result
})

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
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllBannedPeople.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAllBannedPeople.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload
        state.error = null
      })
      .addCase(fetchAllBannedPeople.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? "Failed to fetch all banned people"
      })
  },
})

export const { resetBannedPeopleState } = bannedPeopleDetailsSlice.actions
export default bannedPeopleDetailsSlice.reducer
