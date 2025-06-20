import { axiosInstance } from "@/utils/helper-functions"
import {
    BannedPersonWithBanDetails,
    isPrismaResultError,
    PrismaResultError,
} from "@/utils/types"
import { AxiosResponse } from "axios"

export const getOneBanned = async (bannedPersonId: number) => {
    return await axiosInstance
        .get(`/banned-people/individual/${bannedPersonId}`)
        .then((response: AxiosResponse) => {
            if (isPrismaResultError(response)) {
                return response as PrismaResultError
            }

            return response.data as BannedPersonWithBanDetails
        })
        .catch((error: unknown) => {
            return error as PrismaResultError
        })
}
