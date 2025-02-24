import { fetchAllAccountsDetails } from "@/api-requests/get/accounts/fetchAllAccountsDetails"
import { Account } from "@/utils/types/indexTypes"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

export const fetchOtherAccountData = createAsyncThunk<any>(
  "account/fetchOtherAccountData",
  async () => {
    const result = await fetchAllAccountsDetails()

    if (axios.isAxiosError(result)) {
      return result
    } else {
      return result.data
    }
  },
)
export interface OtherAccountState {
  data: { other_accounts: Account[] | null }
  error: string | null
  isLoading: boolean
}

const initialState: OtherAccountState = {
  data: { other_accounts: null },
  error: null,
  isLoading: false,
}

export const otherAccountDetailsSlice = createSlice({
  name: "other-account-details",
  initialState,
  reducers: {
    resetOtherAccountsState: state => (state = initialState),
  },
  extraReducers: builder => {
    builder
      .addCase(fetchOtherAccountData.pending, state => {
        state.isLoading = true
      })
      .addCase(fetchOtherAccountData.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload
      })
      .addCase(fetchOtherAccountData.rejected, (state, action) => {
        state.isLoading = false
        state.error =
          action.error.message ||
          "There was an error getting your account details"
      })
  },
})

export const { resetOtherAccountsState } =
  otherAccountDetailsSlice.actions
export default otherAccountDetailsSlice.reducer
