import { axiosInstance } from "@/utils/helper-functions"
import {
  isPrismaResultError,
  PrismaResultError,
  Venue,
} from "@/utils/types"
import { AxiosResponse } from "axios"

export const getAllVenues = async () => {
  return await axiosInstance
    .get("/venues")
    .then((response: AxiosResponse) => {
      if (isPrismaResultError(response)) {
        return response as PrismaResultError
      }

      return response.data as Venue[]
    })
    .catch((error: unknown) => {
      return error as PrismaResultError
    })
}
