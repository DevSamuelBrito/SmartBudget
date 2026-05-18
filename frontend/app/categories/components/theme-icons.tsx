// lucide
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

// types 
import type { ThemeIconKey } from "../types";

type ThemeIconProps = {
    iconKey: ThemeIconKey;
    className?: string;
};

const iconMap = {
    ShoppingBasket,
    Lightbulb,
    Droplets,
    Wifi,
    BusFront,
    HeartPulse,
    Cross,
    Gamepad2,
};

export function ThemeIcon({ iconKey, className }: ThemeIconProps) {
    const Icon = iconMap[iconKey];

    return <Icon className={className} />;
}
