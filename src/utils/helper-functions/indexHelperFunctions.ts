import { PrismaClientKnownRequestError } from "../types/indexTypes"

export const isPrismaClientKnownRequestError = (
  objectToCheck: any,
): objectToCheck is PrismaClientKnownRequestError => {
  return objectToCheck.data.name === "PrismaClientKnownRequestError"
}
