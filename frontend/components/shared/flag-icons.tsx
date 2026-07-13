// types
import type { AppLocale } from "@/i18n/routing"

type FlagIconProps = {
  className?: string
}

export function BrazilFlagIcon({ className }: Readonly<FlagIconProps>) {
  return (
    <svg viewBox="0 0 24 18" width="24" height="18" className={className} aria-hidden="true">
      <rect width="24" height="18" fill="#009C3B" />
      <polygon points="12,1.5 22.5,9 12,16.5 1.5,9" fill="#FEDF00" />
      <circle cx="12" cy="9" r="4.2" fill="#002776" />
    </svg>
  )
}

export function UnitedStatesFlagIcon({ className }: Readonly<FlagIconProps>) {
  return (
    <svg viewBox="0 0 24 18" width="24" height="18" className={className} aria-hidden="true">
      <rect width="24" height="18" fill="#B22234" />
      <rect y="1.38" width="24" height="1.38" fill="white" />
      <rect y="4.15" width="24" height="1.38" fill="white" />
      <rect y="6.92" width="24" height="1.38" fill="white" />
      <rect y="9.69" width="24" height="1.38" fill="white" />
      <rect y="12.46" width="24" height="1.38" fill="white" />
      <rect y="15.23" width="24" height="1.38" fill="white" />
      <rect width="10" height="9.69" fill="#3C3B6E" />
    </svg>
  )
}

export const FLAG_ICONS: Record<AppLocale, (props: Readonly<FlagIconProps>) => React.JSX.Element> = {
  "pt-BR": BrazilFlagIcon,
  en: UnitedStatesFlagIcon,
}
