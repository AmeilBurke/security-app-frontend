import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface otherAccountDetailState {
  other_accounts: {
    account_id: number
    account_email: string
    account_password: string
    account_name: string
    account_roleId: number
  }[]
}

const initialState: otherAccountDetailState = {
  other_accounts: [
    {
      account_id: -1,
      account_email: "",
      account_password: "",
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
      action: PayloadAction<otherAccountDetailState>,
    ) => {
      state.other_accounts = action.payload.other_accounts
    },
  },
})

export const { getOtherAccountDetails, setOtherAccountDetails } =
  otherAccountDetailsSlice.actions
export default otherAccountDetailsSlice.reducer
