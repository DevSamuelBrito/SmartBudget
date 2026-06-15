"use client"

// react-query
import { useMutation } from "@tanstack/react-query"

// services
import {
  changeUserPassword as changeUserPasswordRequest,
  updateUserProfile as updateUserProfileRequest,
  type ChangeUserPasswordInput,
  type UpdateUserProfileInput,
} from "@/lib/services/user.service"

export function useUpdateUserProfile() {
  return useMutation({
    mutationFn: (payload: UpdateUserProfileInput) => updateUserProfileRequest(payload),
  })
}

export function useChangeUserPassword() {
  return useMutation({
    mutationFn: (payload: ChangeUserPasswordInput) => changeUserPasswordRequest(payload),
  })
}