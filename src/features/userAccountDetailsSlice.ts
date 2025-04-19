import { getJwt } from "@/api-requests/authentication/getJwt"
import { Account, isPrismaResultError } from "@/utils/types"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const fetchUserAccountDetails = createAsyncThunk<any,{ email: string; password: string }>("account/fetchAccountDetailsData", async ({ email, password }) => {
  const result = await getJwt(email, password)

  if (isPrismaResultError(result)) {
    return null
  }

  return result
})
export interface AccountState {
  data: Account | null
  error: string | null
  isLoading: boolean
}

const initialState: AccountState = {
  data: null,
  isLoading: false,
  error: null,
}

export const userAccountDetailsSlice = createSlice({
  name: "user-account-details",
  initialState,
  reducers: {
    resetUserAccountState: state => (state = initialState),
    setUserAccountState: (state, action) => {
      state.data = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserAccountDetails.pending, state => {
        state.isLoading = true
      })
      .addCase(fetchUserAccountDetails.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload
      })
      .addCase(fetchUserAccountDetails.rejected, (state, action) => {
        state.isLoading = false
        state.error =
          action.error.message ||
          "There was an error getting your account details"
      })
  },
})

export const { resetUserAccountState, setUserAccountState } =
  userAccountDetailsSlice.actions
export default userAccountDetailsSlice.reducer
