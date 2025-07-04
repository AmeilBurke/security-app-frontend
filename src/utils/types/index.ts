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
  alertDetail_alertReason: string
  alertDetail_startTime: string
  alertDetail_alertUploadedBy: number
  Account: {
    account_name: string
  }
}

export type BanDetail = {
  banDetail_id: number
  banDetail_bannedPersonId: number
  banDetail_reason: string
  banDetail_banStartDate: string
  banDetail_banEndDate: string
  banDetail_venueBanId: number
  banDetail_isBanPending: Boolean
  banDetail_banUploadedBy: number
  Account: {
    account_name: string
  }
  Venue: {
    venue_name: string
  }
}

export type PostBanDetail = {
  banDetail_bannedPersonId: number
  banDetail_reason: string
  banDetail_banEndDate: string
  banDetail_venueBanIds: number[]
}

export type BannedPersonWithActiveAlerts = BannedPerson & {
  AlertDetail: AlertDetail[]
  BanDetail: BanDetail[]
}

export type BannedPersonWithBanDetails = BannedPerson & {
  BanDetail: BanDetail[]
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

export type GroupedBan = {
  banDetail_banStartDate: string
  banDetail_banEndDate: string
  banDetail_reason: string
  account_name: string
  venues: string[]
}
