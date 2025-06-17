import { toaster } from "@/components/ui/toaster"
import { PrismaResultError } from "../types"
import axios from "axios"
import { useFileUpload } from "@chakra-ui/react"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import { useLocation } from "react-router"
import { useEffect } from "react"

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

export const capitalizeString = (text: string) => {
  return text
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export const imageFileUploadHandler = (
  setUploadedImageFile: React.Dispatch<React.SetStateAction<File | undefined>>,
) => {
  return useFileUpload({
    accept: ["image/jpeg", "image/png", "image/webp"],
    required: true,
    maxFiles: 1,
    onFileAccept: file => {
      setUploadedImageFile(file.files[0])
    },
    onFileChange: file => {
      if (file.rejectedFiles[0]) {
        toaster.create({
          title: "Upload Error",
          description: "The file you tried to upload isn't valid",
          type: "error",
        })
        setUploadedImageFile(undefined)
        return
      }
      setUploadedImageFile(file.acceptedFiles[0])
    },
    onFileReject: () => {
      toaster.create({
        title: "Upload Error",
        description: "The file you tried to upload isn't valid",
        type: "error",
      })
      setUploadedImageFile(undefined)
    },
  })
}

export const ScrollToPageTop = () => {
    const { pathname } = useLocation()

    useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
    }, [pathname])

    return null
}
