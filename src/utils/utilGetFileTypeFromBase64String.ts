export const utilGetFileTypeFromBase64String = (
  base64String: string,
): string | undefined => {
  let fileExtension
  switch (base64String[0]) {
    case "/":
      fileExtension = "jpg"
      break

    case "i":
      fileExtension = "png"
      break

    case "U":
      fileExtension = "webp"
  }

  return fileExtension
}
