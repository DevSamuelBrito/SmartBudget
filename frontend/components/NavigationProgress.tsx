"use client";

//react
import { useEffect } from "react";

//next
import { usePathname, useSearchParams } from "next/navigation";

//nprogress
import NProgress from "nprogress";

NProgress.configure({ showSpinner: false });

export function NavigationProgress() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        NProgress.done();
    }, [pathname, searchParams]);

    useEffect(() => {
        const start = () => NProgress.start();

        const onClick = (event: MouseEvent) => {
            if (event.button !== 0) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

            const target = event.target as HTMLElement | null;

            const anchor = target?.closest("a") as HTMLAnchorElement | null;

            if (!anchor) return;

            const href = anchor.getAttribute("href");

            if (!href) return;
            if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
            if (anchor.target && anchor.target !== "_self") return;

            const url = new URL(href, window.location.href);

            if (url.origin !== window.location.origin) return;

            start();
        };

        const patchHistory = (method: "pushState" | "replaceState") => {

            const original = history[method];

            history[method] = ((...args) => {
                start();

                return original.apply(history, args as unknown as Parameters<History[typeof method]>);
            }) as History[typeof method];


            return () => {
                history[method] = original;
            };
        };

        const unpatchPush = patchHistory("pushState");
        const unpatchReplace = patchHistory("replaceState");

        document.addEventListener("click", onClick, true);
        window.addEventListener("popstate", start);

        return () => {
            document.removeEventListener("click", onClick, true);
            window.removeEventListener("popstate", start);

            unpatchPush();
            unpatchReplace();
        };
    }, []);

    return null;
}
