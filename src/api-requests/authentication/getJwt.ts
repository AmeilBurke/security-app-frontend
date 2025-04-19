import { axiosInstance } from "@/utils/helper-functions"
import { Account, isPrismaResultError, PrismaResultError } from "@/utils/types"
import { AxiosResponse } from "axios"

export const getJwt = async (givenEmail: string, givenPassword: string) => {
  return await axiosInstance
    .post("/authentication/sign-in", {
      user_email: givenEmail,
      user_password: givenPassword,
    })
    .then((response: AxiosResponse) => {
      if (isPrismaResultError(response)) {
        return response as PrismaResultError
      }

      return response.data as Account
    })
    .catch((error: unknown) => {
      return error as PrismaResultError
    })
}
