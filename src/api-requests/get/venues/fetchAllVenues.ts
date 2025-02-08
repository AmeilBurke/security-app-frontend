import axios, { AxiosError, AxiosResponse } from "axios"

export const fetchAllVenues = async (): Promise<AxiosResponse | AxiosError> => {
  return await axios
    .get(`${import.meta.env.VITE_API_URL}/venues`, {
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
