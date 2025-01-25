import axios, { AxiosError, AxiosResponse } from "axios"

export const getAllManagersForOneVenue = async (
  jwtToken: string,
  venueId: number,
) => {
  return axios
    .get(`${import.meta.env.VITE_API_URL}/venue-managers/venue/${venueId}`, {
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
