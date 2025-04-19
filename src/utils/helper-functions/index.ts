import { toaster } from "@/components/ui/toaster"
import { PrismaResultError } from "../types"
import axios from "axios"

export const displayErrorToastForAxios = (error: PrismaResultError) => {
  return toaster.create({
    title: error.error_type,
    description: `msg: ${error.error_message} | code: ${error.error_code}`,
    type: "error",
  })
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})
