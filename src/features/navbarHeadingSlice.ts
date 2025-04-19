import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  heading: "Dashboard"
}

export const navbarHeadingSlice = createSlice({
  name: "navbar-heading",
  initialState,
  reducers: {
    setNavbarHeadingState: (state, action) => {
      state.heading = action.payload
    },
  },
})

export const { setNavbarHeadingState } = navbarHeadingSlice.actions
export default navbarHeadingSlice.reducer
