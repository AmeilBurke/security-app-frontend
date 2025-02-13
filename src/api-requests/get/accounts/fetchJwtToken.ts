import axios, { AxiosError, AxiosResponse } from "axios"

export const fetchJwtToken = async (
  email: string,
  password: string,
): Promise<AxiosResponse | AxiosError> => {
  return await axios
    .post(`${import.meta.env.VITE_API_URL}/authentication/login`, {
      user_email: email,
      user_password: password,
    })
    .then((response: AxiosResponse) => {
      console.log(response)
      return response
    })
    .catch((error: AxiosError) => {
      console.log(error)
      return error
    })
}
