import { toaster } from "@/components/ui/toaster"
import axios, { AxiosError } from "axios"
import { PrismaClientKnownRequestError } from "./types/indexTypes"

export const utilAxiosErrorToast = (error: AxiosError | PrismaClientKnownRequestError) => {
  if(axios.isAxiosError(error)) {
    return toaster.create({
      title: "Error",
      description: error.message,
      type: "error",
    })
  } else {
    return toaster.create({
      title: "Error",
      description: `code: ${error.code}. ${error.meta.cause}`,
      type: "error",
    })
  }
}
