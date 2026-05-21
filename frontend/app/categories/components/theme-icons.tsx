//lucide react
import {
    BusFront,
    Cross,
    Droplets,
    Gamepad2,
    HeartPulse,
    Lightbulb,
    ShoppingBasket,
    Wifi,
} from "lucide-react";

//react
import type React from "react";

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
} satisfies Record<string, IconComponent>;

export type ThemeIconKey = keyof typeof iconMap;

type ThemeIconProps = {
    iconKey: ThemeIconKey;
    className?: string;
};

export function ThemeIcon({ iconKey, className }: ThemeIconProps) {
    const Icon = iconMap[iconKey];
    return <Icon className={className} />;
}