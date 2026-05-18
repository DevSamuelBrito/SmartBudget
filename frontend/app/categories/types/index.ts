export type ThemeIconKey =
  | "ShoppingBasket"
  | "Lightbulb"
  | "Droplets"
  | "Wifi"
  | "BusFront"
  | "HeartPulse"
  | "Cross"
  | "Gamepad2";

export type CategoryTheme = {
  id: string;
  label: string;
  colorClass: string;
  iconKey: ThemeIconKey;
};

export type Category = {
  id: string;
  name: string;
  themeId: string;
};
