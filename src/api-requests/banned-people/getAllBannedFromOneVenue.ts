import { axiosInstance } from "@/utils/helper-functions"
import {
  BannedPerson,
  isPrismaResultError,
  PrismaResultError,
} from "@/utils/types"
import { AxiosResponse } from "axios"

export const getAllBannedFromOneVenue = async (venueId: number) => {
  return await axiosInstance
    .get(`/banned-people/venue/${venueId}`)
    .then((response: AxiosResponse) => {
      if (isPrismaResultError(response)) {
        return response as PrismaResultError
      }

      return response.data as BannedPerson[]
    })
    .catch((error: unknown) => {
      return error as PrismaResultError
    })
}
