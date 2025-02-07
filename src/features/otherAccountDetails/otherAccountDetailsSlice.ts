import { Account } from "@/utils/types/indexTypes"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: { other_accounts: Account[] } = {
  other_accounts: [
    {
      account_id: -1,
      account_email: "",
      account_name: "",
      account_roleId: -1,
    },
  ],
}

export const otherAccountDetailsSlice = createSlice({
  name: "account-details",
  initialState,
  reducers: {
    getOtherAccountDetails: state => {
      return state
    },
    setOtherAccountDetails: (
      state,
      action: PayloadAction<{ other_accounts: Account[] }>,
    ) => {
      state.other_accounts = action.payload.other_accounts
    },
  },
})

export const { getOtherAccountDetails, setOtherAccountDetails } =
  otherAccountDetailsSlice.actions
export default otherAccountDetailsSlice.reducer
