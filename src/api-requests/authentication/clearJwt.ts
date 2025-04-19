import { axiosInstance } from "@/utils/helper-functions"
import { isPrismaResultError, PrismaResultError } from "@/utils/types"
import { AxiosResponse } from "axios"

export const clearJwt = async () => {
  return await axiosInstance
    .get("/authentication/sign-out")
    .then((response: AxiosResponse) => {
      if (isPrismaResultError(response)) {
        return response as PrismaResultError
      }

      return response.data as string
    })
    .catch((error: unknown) => {
      return error as PrismaResultError
    })
}
