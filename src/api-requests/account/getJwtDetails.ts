import axios, { AxiosError, AxiosResponse } from "axios"

export const getJwtDetails = async (jwtToken: string) => {
  return await axios
    .get(`${import.meta.env.VITE_API_URL}/authentication/profile`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
    .then((response: AxiosResponse) => {
      if (response.data.statusCode) {
        return "error"
      }
      return response.data
    })
    .catch((error: AxiosError) => {
      console.log(error.cause)
      console.log(error.code)
      console.log(error.response?.status)
      if (error.response?.status === 401) {
        return 401
      }
    })
}
