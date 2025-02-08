import { Account } from "@/utils/types/indexTypes"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: Account = {
  account_id: -1,
  account_email: "",
  account_name: "",
  account_roleId: -1,
  role_name: {
    role_id: -1,
    role_name: "",
  },
}

export const userAccountDetailsSlice = createSlice({
  name: "user-account-details",
  initialState,
  reducers: {
    getUserAccountDetails: state => {
      return state
    },
    setUserAccountDetails: (state, action: PayloadAction<Account>) => {
      state.account_id = action.payload.account_id
      state.account_email = action.payload.account_email
      state.account_name = action.payload.account_name
      state.account_roleId = action.payload.account_roleId
      state.role_name = {
        role_id: action.payload.role_name.role_id,
        role_name: action.payload.role_name.role_name,
      }
    },
  },
})

export const { getUserAccountDetails, setUserAccountDetails } = userAccountDetailsSlice.actions
export default userAccountDetailsSlice.reducer
