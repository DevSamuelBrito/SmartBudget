//react
import type React from "react";

//lucide react
import {
    BusFront,
    Car,
    Cross,
    Droplets,
    Gamepad2,
    GraduationCap,
    HeartPulse,
    Home,
    Lightbulb,
    Receipt,
    ShoppingBag,
    ShoppingBasket,
    Utensils,
    Wifi,
    Plane,
    Gem,
    Trophy,
    Crown,
    Rocket,
    Sparkles,
    Star,
    Zap,
} from "lucide-react";

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export const iconMap = {
    ShoppingBasket,
    Lightbulb,
    Droplets,
    Wifi,
    BusFront,
    HeartPulse,
    Cross,
    Gamepad2,
    Utensils,
    Car,
    Home,
    GraduationCap,
    Receipt,
    ShoppingBag,
    Plane,
    Gem,
    Trophy,
    Crown,
    Rocket,
    Sparkles,
    Star,
    Zap,
} satisfies Record<string, IconComponent>;

export type ThemeIconKey = keyof typeof iconMap;

export const PREMIUM_ICON_KEYS: ThemeIconKey[] = [
    "Plane",
    "Gem",
    "Trophy",
    "Crown",
    "Rocket",
    "Sparkles",
    "Star",
    "Zap",
];

type ThemeIconProps = {
    iconKey: ThemeIconKey;
    className?: string;
};

export function ThemeIcon({ iconKey, className }: Readonly<ThemeIconProps>) {
    const Icon = iconMap[iconKey];

    return <Icon className={className} />;
}
