import axios, { AxiosError, AxiosResponse } from "axios"

export const fetchAllAlertDetails = async (): Promise<AxiosResponse | AxiosError> => {
  return await axios
    .get(`${import.meta.env.VITE_API_URL}/alert-details`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
    .then((response: AxiosResponse) => {
      return response
    })
    .catch((error: AxiosError) => {
      return error
    })
}
