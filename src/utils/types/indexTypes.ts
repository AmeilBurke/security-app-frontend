export type AlertDetails = {
  alertDetail_id: number
  alertDetail_bannedPersonId: number | null
  alertDetail_name: string
  alertDetail_imageName: string
  alertDetails_alertReason: string
  alertDetails_startTime: string
  alertDetails_alertUploadedBy: number
}

export type Account = {
  account_id: number
  account_email: string
  account_name: string
  account_roleId: number
}

export type Venue = {
  venue_id: number
  venue_name: string
  venue_imagePath: string
}

export type Role = {
  role_id: number
  role_name: string
}

export type bannedPerson = {
  bannedPerson_id: number
  bannedPerson_name: string
  bannedPerson_imageName: string
}

export type banDetail = {
  banDetails_id: number
  banDetails_bannedPersonId: number
  banDetails_reason: string
  banDetails_banStartDate: string
  banDetails_banEndDate: string
  banDetails_venueBanId: number
  banDetails_isBanPending: boolean
  banDetails_banUploadedBy: number
}
