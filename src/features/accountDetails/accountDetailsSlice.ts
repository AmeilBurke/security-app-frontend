import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface accountDetailState {
  account_id: number
  account_email: string
  account_password: string
  account_name: string
  account_roleId: number
}

const initialState: accountDetailState = {
  account_id: -1,
  account_email: "",
  account_password: "",
  account_name: "",
  account_roleId: -1,
}

export const accountDetailsSlice = createSlice({
  name: "account-details",
  initialState,
  reducers: {
    getAccountDetails: state => {
      return state
    },
    setAccountDetails: (state, action: PayloadAction<accountDetailState>) => {
      state.account_id = action.payload.account_id
      state.account_email = action.payload.account_email
      state.account_password = action.payload.account_password
      state.account_name = action.payload.account_name
      state.account_roleId = action.payload.account_roleId
    },
  },
})

export const { getAccountDetails, setAccountDetails } =
  accountDetailsSlice.actions
export default accountDetailsSlice.reducer
