import { axiosInstance } from "@/utils/helper-functions"
import { isPrismaResultError, PrismaResultError } from "@/utils/types"
import { AxiosResponse } from "axios"

export const postNewAlert = async (alertDetails: FormData) => {
  return await axiosInstance
    .post("/alert-details", alertDetails)
    .then((response: AxiosResponse) => {
      console.log(response)
      if (isPrismaResultError(response) || isPrismaResultError(response.data)) {
        return isPrismaResultError(response) ? response : response.data
      }

      return response.data
    })
    .catch((error: unknown) => {
      return error as PrismaResultError
    })
}
