export const getJwtFromLocalStorage = (): string | null => {
  return localStorage.getItem("jwt")
}
