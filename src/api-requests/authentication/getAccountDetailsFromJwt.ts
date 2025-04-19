import { axiosInstance } from "@/utils/helper-functions"
import { Account, isPrismaResultError, PrismaResultError } from "@/utils/types"
import { AxiosResponse, isAxiosError } from "axios"

export const getAccountDetailsFromJwt = async () => {
  return await axiosInstance
    .get("/authentication/profile")
    .then((response: AxiosResponse) => {
      if (isPrismaResultError(response)) {
        return response as PrismaResultError
      }

      return response.data as Account
    })
    .catch((error: unknown) => {
      if (isAxiosError(error)) {
        if (error.message === "Request failed with status code 401") {
          return {
            error_type: "Invalid Token",
            error_code: "401",
            error_message: "A valid token was not provided",
          } as PrismaResultError
        }
      }

      return error as PrismaResultError
    })
}
