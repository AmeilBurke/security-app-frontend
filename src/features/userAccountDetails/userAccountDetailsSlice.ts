import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface userAccountDetailState {
  account_id: number
  account_email: string
  account_password: string
  account_name: string
  account_roleId: number
}

const initialState: userAccountDetailState = {
  account_id: -1,
  account_email: "",
  account_password: "",
  account_name: "",
  account_roleId: -1,
}

export const userAccountDetailsSlice = createSlice({
  name: "account-details",
  initialState,
  reducers: {
    getUserAccountDetails: state => {
      return state
    },
    setUserAccountDetails: (state, action: PayloadAction<userAccountDetailState>) => {
      state.account_id = action.payload.account_id
      state.account_email = action.payload.account_email
      state.account_password = action.payload.account_password
      state.account_name = action.payload.account_name
      state.account_roleId = action.payload.account_roleId
    },
  },
})

export const { getUserAccountDetails, setUserAccountDetails } = userAccountDetailsSlice.actions
export default userAccountDetailsSlice.reducer
