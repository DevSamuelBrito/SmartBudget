// libs
import { api } from "@/lib/axios"

export type UpdateUserProfileInput = {
  name: string
  email: string
}

export type ChangeUserPasswordInput = {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export const updateUserProfile = async (payload: UpdateUserProfileInput) => {
  await api.put("/users/profile", payload)
}

export const changeUserPassword = async (payload: ChangeUserPasswordInput) => {
  await api.put("/users/change-password", payload)
}

export type UpgradeUserToPremiumOutput = {
  userId: string
  name: string
  email: string
  isPremium: boolean
}

export const upgradeUserToPremium = async (): Promise<UpgradeUserToPremiumOutput> => {
  const response = await api.put<UpgradeUserToPremiumOutput>("/users/upgrade")
  
  return response.data
}