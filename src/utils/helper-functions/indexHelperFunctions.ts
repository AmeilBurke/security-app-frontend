import { useAppDispatch } from "@/app/hooks"
import { PrismaClientKnownRequestError } from "../types/indexTypes"
import { resetUserAccountState } from "@/features/userAccountDetails/userAccountDetailsSlice"
import { resetAlertDetailsState } from "@/features/alertDetails/alertDetailsSlice"
import { resetBannedPeopleState } from "@/features/bannedPeople/bannedPeopleSlice"
import { resetOtherAccountsState } from "@/features/otherAccountDetails/otherAccountDetailsSlice"
import { resetVenuesState } from "@/features/venues/venuesSlice"
import { useNavigate } from "react-router"

export const isPrismaClientKnownRequestError = (
  objectToCheck: any,
): objectToCheck is PrismaClientKnownRequestError => {
  return objectToCheck.data.name === "PrismaClientKnownRequestError"
}
