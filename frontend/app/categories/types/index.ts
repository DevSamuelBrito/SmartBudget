export type CategoryApi = {
  id: string;
  userId: string;
  name: string;
  icon: ThemeIconKey;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  themeId: string;
};

import type { ThemeIconKey } from "../components/theme-icons";

export type { ThemeIconKey };

export type CategoryTheme = {
    id: string;
    label: string;
    colorClass: string;
    iconKey: ThemeIconKey;
};