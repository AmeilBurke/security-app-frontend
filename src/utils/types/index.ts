export type PrismaResultError = {
  error_type: string
  error_code: string
  error_message: string
}

export const isPrismaResultError = (
  object: any,
): object is PrismaResultError => {
  return (
    typeof object === "object" &&
    object !== null &&
    typeof object.error_type === "string" &&
    typeof object.error_code === "string" &&
    typeof object.error_message === "string"
  )
}

export type Account = {
  account_id: number
  account_email: string
  account_name: string
  account_roleId: number
  Role: {
    role_id: number
    role_name: string
  }
}

export type BannedPerson = {
  bannedPerson_name: string
  bannedPerson_id: number
  bannedPerson_imagePath: string
}

export type AlertDetail = {
  alertDetail_id: number
  alertDetail_bannedPersonId: number
  alertDetail_name: string
  alertDetail_imagePath: string
  alertDetails_alertReason: string
  alertDetails_startTime: string
  alertDetails_alertUploadedBy: number
  Account: {
    account_name: string
  }
}

export type BanDetail = {
  alertDetail_id: number
  alertDetail_bannedPersonId: number
  alertDetail_name: string
  alertDetail_imagePath: string
  alertDetails_alertReason: string
  alertDetails_startTime: string
  alertDetails_alertUploadedBy: number
  Account: {
    account_name: string
  }
}

export type PostBanDetail = {
  banDetails_bannedPersonId: number
  banDetails_reason: string
  banDetails_banEndDate: string
  banDetails_venueBanIds: number[]
}

export type BannedPersonWithActiveAlerts = BannedPerson & {
  AlertDetail: AlertDetail[]
  BanDetails: BanDetail[]
}
export type Venue = {
  venue_id: number
  venue_name: string
  venue_imagePath: string
  VenueManager: [
    {
      venueManager_id: number
      venueManager_venueId: number
      venueManager_accountId: number
    },
  ]
}
