import axios, { AxiosError, AxiosResponse } from "axios"

export const updateUserAccountDetails = async (accountId: number, userDetailsToUpdate: { account_email?: string, account_password?: string, account_name?: string }): Promise<AxiosResponse | AxiosError> => {
    return await axios
        .patch(`${import.meta.env.VITE_API_URL}/accounts/${accountId}`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            data: {
                account_email: userDetailsToUpdate.account_email,
                account_password: userDetailsToUpdate.account_password,
                account_name: userDetailsToUpdate.account_name
            }
        })
        .then((response: AxiosResponse) => {
            return response
        })
        .catch((error: AxiosError) => {
            return error
        })
}
