import { Role } from "@/utils/types/indexTypes"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: { roles: Role[] } = {
  roles: [
    {
      role_id: -1,
      role_name: "",
    },
  ],
}

export const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    getRoles: state => {
      return state
    },
    setRoles: (state, action: PayloadAction<{ roles: Role[] }>) => {
      state.roles = action.payload.roles
    },
  },
})

export const { getRoles, setRoles } = rolesSlice.actions
export default rolesSlice.reducer
