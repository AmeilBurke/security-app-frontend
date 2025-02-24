import axios, { AxiosError, AxiosResponse } from "axios"

export const updateUserAccountDetails = async (accountId: number, userDetailsToUpdate: { account_email?: string, account_old_password: string | undefined, account_password?: string, account_name?: string }): Promise<AxiosResponse | AxiosError> => {
    return await axios
        .patch(`${import.meta.env.VITE_API_URL}/accounts/${accountId}`, {
            account_email: userDetailsToUpdate.account_email,
            account_old_password: userDetailsToUpdate.account_old_password,
            account_password: userDetailsToUpdate.account_password, 
            account_name: userDetailsToUpdate.account_name, 
        }, {
            headers: {
                authorization: `Bearer 9zr/qjrEUB1XcIPGU7kWF/a4lACEaFUHZQssvVlBbzs035h9tIq1/mpdjSd4iS3/iEhvZvG3i9wKeEtmfxq7ePpe9rVi4QmVsfcFMpKzC00rMhPoiRTjb+LLze6OsbGp//2TGEBL3ix1MC45cUhfZBL/94AH48OoKBOxItruDZoq2gUjOvuGqgLX4PliaFrbmIo6q3HBqC0//1xLNMRFtM+LvKERUwDbRF8/UO31NXRr6cpP9cbxoxQ/8E5tbbiLqOTC`,
            },
            
        })
        .then((response: AxiosResponse) => {
            return response
        })
        .catch((error: AxiosError) => {
            return error
        })
}
