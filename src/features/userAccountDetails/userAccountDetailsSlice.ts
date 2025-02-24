import { fetchIndividualAccountDetails } from "@/api-requests/get/accounts/fetchIndividualAccountDetails"
import { Account } from "@/utils/types/indexTypes"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

export const fetchUserAccountData = createAsyncThunk<any, number>(
  "account/fetchAccountData",
  async (accountId: number) => {
    const result = await fetchIndividualAccountDetails(accountId)

    if (axios.isAxiosError(result)) {
      return result
    } else {
      return result.data
    }
  },
)
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
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserAccountData.pending, state => {
        state.isLoading = true
      })
      .addCase(fetchUserAccountData.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload
      })
      .addCase(fetchUserAccountData.rejected, (state, action) => {
        state.isLoading = false
        state.error =
          action.error.message ||
          "There was an error getting your account details"
      })
  },
})

export const { resetUserAccountState, setUserAccountState } = userAccountDetailsSlice.actions
export default userAccountDetailsSlice.reducer
