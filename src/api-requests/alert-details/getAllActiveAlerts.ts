import { axiosInstance } from "@/utils/helper-functions"
import {
  AlertDetail,
  BannedPerson,
  isPrismaResultError,
  PrismaResultError,
} from "@/utils/types"
import { AxiosResponse } from "axios"

export const getAllActiveAlerts = async () => {
  return await axiosInstance
    .get("/alert-details")
    .then((response: AxiosResponse) => {
      if (isPrismaResultError(response)) {
        return response as PrismaResultError
      }

      return response.data as AlertDetail[]
    })
    .catch((error: unknown) => {
      return error as PrismaResultError
    })
}
