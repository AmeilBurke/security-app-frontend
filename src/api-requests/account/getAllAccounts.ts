import axios, { AxiosError, AxiosResponse } from "axios"

export const getAllAccounts = async (jwtToken: string) => {
  return await axios
    .get(`${import.meta.env.VITE_API_URL}/accounts`, {
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
