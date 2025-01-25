import axios, { AxiosError, AxiosResponse } from "axios"

export const getAllBannedPeople = async (jwtToken: string) => {
  return await axios
    .get(`${import.meta.env.VITE_API_URL}/banned-people`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
    .then((response: AxiosResponse) => {
      return response.data
    })
    .catch((error: AxiosError) => {
      console.log(error.cause)
      console.log(error.code)
    })
}
