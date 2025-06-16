import { axiosInstance } from "@/utils/helper-functions"
import {
  isPrismaResultError,
  PostBanDetail,
  PrismaResultError,
} from "@/utils/types"
import { AxiosResponse } from "axios"

export const postNewBanDetail = async (details: PostBanDetail) => {
  return await axiosInstance
    .post("/ban-details", {
      banDetails_bannedPersonId: details.banDetails_bannedPersonId,
      banDetails_reason: details.banDetails_reason,
      banDetails_banEndDate: details.banDetails_banEndDate,
      banDetails_venueBanIds: details.banDetails_venueBanIds
    })
    .then((response: AxiosResponse) => {
      if (isPrismaResultError(response)) {
        return response as PrismaResultError
      }

      return response.data
    })
    .catch((error: unknown) => {
      return error as PrismaResultError
    })
}
