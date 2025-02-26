import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import userAccountDetailsSlice from "@/features/userAccountDetails/userAccountDetailsSlice"
import otherAccountDetailsSlice from "@/features/otherAccountDetails/otherAccountDetailsSlice"
import bannedPeopleSlice from "@/features/bannedPeople/bannedPeopleSlice"
import alertDetailsSlice from "@/features/alertDetails/alertDetailsSlice"
import venuesSlice from "@/features/venues/venuesSlice"
import navbarHeadingSlice from "@/features/navbarHeading/navbarHeadingSlice"

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
const rootReducer = combineSlices({
  userAccountDetailsSlice,
  otherAccountDetailsSlice,
  bannedPeopleSlice,
  alertDetailsSlice,
  venuesSlice,
  navbarHeadingSlice,
})
// Infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof rootReducer>

// The store setup is wrapped in `makeStore` to allow reuse
// when setting up tests that need the same store config
export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  })
  // configure listeners using the provided defaults
  // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
  setupListeners(store.dispatch)
  return store
}

export const store = makeStore()

// Infer the type of `store`
export type AppStore = typeof store
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
