import { BanDetail, BannedPersonWithBanDetail } from '@/utils/types/indexTypes'
import { utilGetFileTypeFromBase64String } from '@/utils/functions/utilGetFileTypeFromBase64String'
import { VStack, Image, Heading, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs';

const ComponentBannedPersonCards = ({ bannedPeopleWithDetails }: { bannedPeopleWithDetails: BannedPersonWithBanDetail }) => {
    const imageType = utilGetFileTypeFromBase64String(bannedPeopleWithDetails.bannedPerson_imageName)
    const [latestBanDate, setLatestBanDate] = useState<string | undefined>(undefined)

    // need to re-write this
    useEffect(() => {
        console.log(bannedPeopleWithDetails)

    }, [])


    return (
        // need to show latest ban date
        <VStack>
            {/* <Image
                w="full"
                fit="contain"
                p={0}
                border="xs"
                borderColor={"lightgray"}
                shadow="sm"
                src={`data:${imageType};base64,${bannedPeopleWithDetails.bannedPerson_imageName}`}
            />
            <Heading>{bannedPeopleWithDetails.bannedPerson_name}</Heading>
            <Text>{latestBanDate}</Text>
            <Text>wow</Text> */}
        </VStack>
    )
}

export default ComponentBannedPersonCards
