import { toaster } from "@/components/ui/toaster"
import { AxiosError } from "axios"

export const utilAxiosErrorToast = (error: AxiosError) => {
  return toaster.create({
    title: "Error",
    description: error.message,
    type: "error",
  })
}
