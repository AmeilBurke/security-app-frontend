import axios, { AxiosError, AxiosResponse } from "axios"

export const getAllVenues = async (jwtToken: string) => {
  return axios
    .get(`${import.meta.env.VITE_API_URL}/venues`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
    .then((response: AxiosResponse) => {
      // console.log(response.data)
      return response.data
    })
    .catch((error: AxiosError) => {
      console.log(error.cause)
      console.log(error.code)
    })
}
