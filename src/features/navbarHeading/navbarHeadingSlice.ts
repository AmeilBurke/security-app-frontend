import { createSlice } from "@reduxjs/toolkit"

const initialState: { heading: string } = {
  heading: "",
}

export const navbarHeadingSlice = createSlice({
  name: "navbar-heading",
  initialState,
  reducers: {
    getHeading: state => state,
    setHeading: (state, action) => {
      state.heading = action.payload
    },
  },
})

export const { getHeading, setHeading } = navbarHeadingSlice.actions
export default navbarHeadingSlice.reducer
