import ComponentCenteredSpinner from '@/components/centeredSpinner/ComponentCenteredSpinner'
import ComponentContainer from '@/components/container/ComponentContainer'
import { Box } from '@chakra-ui/react'

const PageFallback = () => {
  return (
    <ComponentContainer >
      <Box mt={8} >
        <ComponentCenteredSpinner />
      </Box>
    </ComponentContainer>
  )
}

export default PageFallback