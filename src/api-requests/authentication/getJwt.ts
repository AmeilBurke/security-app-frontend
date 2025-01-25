import axios, { AxiosError, AxiosResponse } from "axios"

export const getAndStoreJwt = async (
  accountEmail: string,
  accountPassword: string,
) => {
  return await axios
    .post(`${import.meta.env.VITE_API_URL}/authentication/login`, {
      user_email: accountEmail,
      user_password: accountPassword,
    })
    .then((response: AxiosResponse) => {
      if (
        response.data ===
        "there was an error signing in, check your email & try again"
      ) {
        return "error"
      }
      // localStorage.setItem("jwt", response.data)
      return response.data
    })
    .catch((error: AxiosError) => {
      console.log(error.cause)
      console.log(error.code)
    })
}
