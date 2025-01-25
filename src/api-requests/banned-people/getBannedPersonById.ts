import axios, { AxiosError, AxiosResponse } from "axios"

export const getBannedPersonById = async (jwtToken: string, bannedPersonId: number) => {
  return await axios
    .get(`${import.meta.env.VITE_API_URL}/banned-people/${bannedPersonId}`, {
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
