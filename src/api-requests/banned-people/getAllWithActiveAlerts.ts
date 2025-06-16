import { axiosInstance } from "@/utils/helper-functions"
import {
  BannedPerson,
  BannedPersonWithActiveAlerts,
  isPrismaResultError,
  PrismaResultError,
} from "@/utils/types"
import { AxiosResponse } from "axios"

export const getAllWithActiveAlerts = async () => {
  return await axiosInstance
    .get("/banned-people/active-alert")
    .then((response: AxiosResponse) => {
      if (isPrismaResultError(response)) {
        return response as PrismaResultError
      }

      return response.data as BannedPersonWithActiveAlerts[]
    })
    .catch((error: unknown) => {
      return error as PrismaResultError
    })
}
