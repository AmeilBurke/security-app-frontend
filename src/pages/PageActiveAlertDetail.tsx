import { useAppDispatch } from "@/app/hooks";
import { capitalizeString } from "@/utils/helper-functions";
import { AlertDetail } from "@/utils/types";
import { Spinner, VStack, Image, Text, DataList } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";


const PageActiveAlertDetail = () => {
  const alertDetails = useLoaderData<AlertDetail>();
  
  const dispatch = useAppDispatch()
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true)

  useEffect(() => {
    if(isInitialLoad) {
      
    }
  }, [])

  if (!alertDetails) {
    return <Spinner />
  }

  return (
    <VStack>
      <Image maxH={'75vh'} w="full" aspectRatio='1' objectFit='contain' src={alertDetails.alertDetail_imagePath} />
      <DataList.Root w="full" orientation='horizontal' divideY="1px" variant='bold'>
        <DataList.Item pt="4">
          <DataList.ItemLabel>Name</DataList.ItemLabel>
          <DataList.ItemValue>{capitalizeString(alertDetails.alertDetail_name)}</DataList.ItemValue>
        </DataList.Item>
        <DataList.Item pt="4">
          <DataList.ItemLabel>Reason For Alert</DataList.ItemLabel>
          <DataList.ItemValue>{capitalizeString(alertDetails.alertDetail_alertReason)}</DataList.ItemValue>
        </DataList.Item>
        <DataList.Item pt="4">
          <DataList.ItemLabel>Time Of Alert</DataList.ItemLabel>
          <DataList.ItemValue>{dayjs(alertDetails.alertDetail_startTime).local().format("hh:mm a")}</DataList.ItemValue>
        </DataList.Item>
        <DataList.Item pt="4">
          <DataList.ItemLabel>Alert Uploaded By</DataList.ItemLabel>
          <DataList.ItemValue>{capitalizeString(alertDetails.Account.account_name)}</DataList.ItemValue>
        </DataList.Item>
      </DataList.Root>
    </VStack>
  )
}

export default PageActiveAlertDetail