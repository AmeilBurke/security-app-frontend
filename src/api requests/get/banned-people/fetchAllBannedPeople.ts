import axios, { AxiosError, AxiosResponse } from "axios"

export const fetchAllBannedPeople = async (): Promise<AxiosResponse | AxiosError> => {
  return await axios
    .get(`${import.meta.env.VITE_API_URL}/banned-people`, {
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
