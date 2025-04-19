import { getAccountDetailsFromJwt } from '@/api-requests/authentication/getAccountDetailsFromJwt'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import ComponentNavbar from '@/components/navbar/ComponentNavbar'
import { setUserAccountState } from '@/features/userAccountDetailsSlice'
import { isPrismaResultError } from '@/utils/types'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

const PageApp = () => {
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true)
    const userAccountDetails = useAppSelector(state => state.userAccountDetailsSlice)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const autoLoginHandler = async () => {
        console.log('tried autologin')
        const result = await getAccountDetailsFromJwt()
        console.log(result)
        if (isPrismaResultError(result)) {
            navigate("/sign-in")
            return
        }
        dispatch(setUserAccountState(result))
    }

    useEffect(() => {
        if (isInitialLoad) {
            autoLoginHandler()
            setIsInitialLoad(false)
        }
    }, [isInitialLoad])

    return (
        <>
            {
                userAccountDetails.data === null
                    ? null
                    : <ComponentNavbar />
            }
        </>
    )
}

export default PageApp