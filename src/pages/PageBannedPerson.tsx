import { useAppDispatch } from "@/app/hooks"
import { setNavbarHeadingState } from "@/features/navbarHeadingSlice"
import { capitalizeString } from "@/utils/helper-functions"
import { BanDetail, BannedPersonWithBanDetails, GroupedBan } from "@/utils/types"
import { VStack, DataList, Image, Text, Heading } from "@chakra-ui/react"
import dayjs from "dayjs"
import { useEffect } from "react"
import { useLoaderData } from "react-router"

const PageBannedPerson = () => {
  const bannedPerson = useLoaderData<BannedPersonWithBanDetails>()
  const dispatch = useAppDispatch()

  const activeBanDetails = bannedPerson.BanDetail.filter(banDetail => {
    if (dayjs(banDetail.banDetail_banEndDate) > dayjs()) {
      return banDetail
    }
  })

  const banDetailsGrouped = (banDetailsUngrouped: BanDetail[]) => {
    const map = new Map<string, GroupedBan>()

    banDetailsUngrouped.map(banDetail => {
      const key = `${banDetail.banDetail_banStartDate}|${banDetail.banDetail_banEndDate}|${banDetail.banDetail_reason}|${banDetail.Account.account_name}`

      if (!map.has(key)) {
        map.set(key, {
          banDetail_banStartDate: banDetail.banDetail_banStartDate,
          banDetail_banEndDate: banDetail.banDetail_banEndDate,
          banDetail_reason: banDetail.banDetail_reason,
          account_name: banDetail.Account.account_name,
          venues: [banDetail.Venue.venue_name]
        })
      } else {
        map.get(key)!.venues.push(banDetail.Venue.venue_name)
      }
    })

    return Array.from(map.values())

  }

  const expiredBanDetails = bannedPerson.BanDetail.filter(banDetail => {
    if (dayjs(banDetail.banDetail_banEndDate) < dayjs()) {
      return banDetail
    }
  })

  useEffect(() => {
    dispatch(
      setNavbarHeadingState(capitalizeString(bannedPerson.bannedPerson_name)),
    )
  }, [])

  return (
    <VStack gap={8} >
      <Image
        maxH={"75vh"}
        w="full"
        aspectRatio="1"
        objectFit="contain"
        src={bannedPerson.bannedPerson_imagePath}
      />

      <VStack w="full">
        {activeBanDetails.length === 0 ? (
          <Text>Account has no active bans.</Text>
        ) : (
          <VStack w="full" gap={8} >
            <Heading>Active Bans</Heading>
            {
              banDetailsGrouped(activeBanDetails).map((banGrouped, index) => {
                console.log(banGrouped)
                return (
                  <VStack w="full" key={index}>
                    <DataList.Root
                      w="full"
                      p={4}
                      orientation="horizontal"
                      size="md"
                      bg={index % 2 === 0 ? "gray.50" : ""}
                    >
                      <DataList.Item py={4}>
                        <DataList.ItemLabel>Start Date</DataList.ItemLabel>
                        <DataList.ItemValue>
                          {dayjs(banGrouped.banDetail_banStartDate).format('dddd, MMMM D, YYYY')}
                        </DataList.ItemValue>
                      </DataList.Item>
                      <DataList.Item py={4}>
                        <DataList.ItemLabel>End Date</DataList.ItemLabel>
                        <DataList.ItemValue>
                          {dayjs(banGrouped.banDetail_banEndDate).format('dddd, MMMM D, YYYY')}
                        </DataList.ItemValue>
                      </DataList.Item>
                      <DataList.Item py={4}>
                        <DataList.ItemLabel>Ban Reason</DataList.ItemLabel>
                        <DataList.ItemValue>
                          {capitalizeString(banGrouped.banDetail_reason)}
                        </DataList.ItemValue>
                      </DataList.Item>
                      <DataList.Item py={4}>
                        <DataList.ItemLabel>Banned From</DataList.ItemLabel>
                        {
                          <DataList.ItemValue>
                            <VStack as="ul" gap={4} alignItems='flex-start' >
                              {
                                banGrouped.venues.map((venueName, index) => {
                                  return <li key={index}>{capitalizeString(venueName)}</li>
                                })
                              }
                            </VStack>
                          </DataList.ItemValue>
                        }
                      </DataList.Item>
                      <DataList.Item py={4}>
                        <DataList.ItemLabel>Ban Given By</DataList.ItemLabel>
                        <DataList.ItemValue>
                          {capitalizeString(banGrouped.account_name)}
                        </DataList.ItemValue>
                      </DataList.Item>

                    </DataList.Root>
                  </VStack>
                )
              })
            }
          </VStack>
        )}
      </VStack>
      {
        expiredBanDetails.length === 0
          ? null
          : <VStack w="full" gap={8} >
            <Heading>Expired Bans</Heading>
            {
              banDetailsGrouped(expiredBanDetails).map((banGrouped, index) => {
                return (
                  <VStack w="full" key={index}>
                    <DataList.Root
                      w="full"
                      p={4}
                      orientation="horizontal"
                      bg={index % 2 === 0 ? "gray.100" : ""}
                    >
                      <DataList.Item>
                        <DataList.ItemLabel>Start Date</DataList.ItemLabel>
                        <DataList.ItemValue>
                          {dayjs(banGrouped.banDetail_banStartDate).format('dddd, MMMM D, YYYY')}
                        </DataList.ItemValue>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.ItemLabel>End Date</DataList.ItemLabel>
                        <DataList.ItemValue>
                          {dayjs(banGrouped.banDetail_banEndDate).format('dddd, MMMM D, YYYY')}
                        </DataList.ItemValue>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.ItemLabel>Ban Reason</DataList.ItemLabel>
                        <DataList.ItemValue>
                          {capitalizeString(banGrouped.banDetail_reason)}
                        </DataList.ItemValue>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.ItemLabel>Ban Given By</DataList.ItemLabel>
                        <DataList.ItemValue>
                          {capitalizeString(banGrouped.account_name)}
                        </DataList.ItemValue>
                      </DataList.Item>
                      <DataList.Item py={4}>
                        <DataList.ItemLabel>Banned From</DataList.ItemLabel>
                        {
                          <DataList.ItemValue>
                            <VStack as="ul" gap={4} alignItems='flex-start' >
                              {
                                banGrouped.venues.map((venueName, index) => {
                                  return <li key={index}>{capitalizeString(venueName)}</li>
                                })
                              }
                            </VStack>
                          </DataList.ItemValue>
                        }
                      </DataList.Item>
                    </DataList.Root>
                  </VStack>
                )
              })
            }
          </VStack>
      }
    </VStack>
  )
}

export default PageBannedPerson
