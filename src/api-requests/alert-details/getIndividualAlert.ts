import { axiosInstance } from "@/utils/helper-functions"
import {
  AlertDetail,
  isPrismaResultError,
  PrismaResultError,
} from "@/utils/types"
import { AxiosResponse } from "axios"

export const getAllIndividualAlert = async (alertId: number) => {
  return await axiosInstance
    .get(`/alert-details/${alertId}`)
    .then((response: AxiosResponse) => {
      if (isPrismaResultError(response)) {
        return response as PrismaResultError
      }

      return response.data as AlertDetail
    })
    .catch((error: unknown) => {
      return error as PrismaResultError
    })
}
