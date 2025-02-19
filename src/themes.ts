import { createSystem, defaultConfig } from "@chakra-ui/react"

// todo: figure this out
export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fontWeights: {
        heading: { value: "4rem" },
      },
    },
  },
})
