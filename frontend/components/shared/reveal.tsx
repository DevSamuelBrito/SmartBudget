"use client";

// react
import { useLayoutEffect, useRef } from "react";

// utils
import { cn } from "@/lib/utils";

type RevealProps = React.ComponentProps<"div"> & {

  /** Stagger index; spaces out sibling reveals. */
  index?: number;

  /** Base delay per index step, in ms. */
  step?: number;
};

/**
 * Progressive-enhancement scroll reveal. The element is fully visible by default
 * (SSR markup, no-JS, crawlers, headless renderers never ship blank content) — the
 * hidden starting state is applied imperatively in a layout effect, which only ever
 * runs after JS has loaded, so there is no flash for the common case either.
 */
export function Reveal({ className, index = 0, step = 80, children, ...props }: Readonly<RevealProps>) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const node = ref.current;

    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    node.style.opacity = "0";
    node.style.transform = "translateY(1rem)";
    node.style.transitionProperty = "opacity, transform";
    node.style.transitionDuration = "700ms";
    node.style.transitionTimingFunction = "cubic-bezier(0.16, 1, 0.3, 1)";
    node.style.transitionDelay = `${index * step}ms`;

    const reveal = () => {
      node.style.opacity = "";
      node.style.transform = "";
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.unobserve(node);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [index, step]);

  return (
    <div ref={ref} className={cn(className)} {...props}>
      {children}
    </div>
  );
}
