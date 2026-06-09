//react
import type { ReactNode } from "react";

type AuthLayoutProps = {
	children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
	return <section className="min-h-svh bg-muted/20">{children}</section>;
}
