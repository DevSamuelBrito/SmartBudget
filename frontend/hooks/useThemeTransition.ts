"use client";

// react
import { useCallback } from "react";

import { flushSync } from "react-dom";

// next-themes
import { useTheme } from "next-themes";

type ThemeChangeEvent = Pick<MouseEvent, "clientX" | "clientY">;

function playCircularReveal(x: number, y: number) {
  const root = document.documentElement;

  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  root.style.setProperty("--theme-toggle-x", `${x}px`);
  root.style.setProperty("--theme-toggle-y", `${y}px`);
  root.style.setProperty("--theme-toggle-radius", `${endRadius}px`);
}

export function useThemeTransition() {
  const { setTheme } = useTheme();

  const changeTheme = useCallback(
    (theme: string, event: ThemeChangeEvent) => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (typeof document.startViewTransition !== "function" || reduceMotion) {
        setTheme(theme);

        return;
      }

      playCircularReveal(event.clientX, event.clientY);

      document.startViewTransition(() => {
        flushSync(() => setTheme(theme));
      });
    },
    [setTheme],
  );

  return { changeTheme };
}
