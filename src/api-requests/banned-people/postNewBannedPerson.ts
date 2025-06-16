import { axiosInstance } from "@/utils/helper-functions"
import {
  isPrismaResultError,
  PrismaResultError,
} from "@/utils/types"
import { AxiosResponse } from "axios"

export const postNewBannedPerson = async (bannedPersonDetails: FormData) => {
  return await axiosInstance
    .post("/banned-people", bannedPersonDetails, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response: AxiosResponse) => {
      if (isPrismaResultError(response)) {
        return response as PrismaResultError
      }

      return response.data as any
    })
    .catch((error: unknown) => {
      return error as PrismaResultError
    })
}
