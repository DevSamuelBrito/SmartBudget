//next
import { cookies } from "next/headers";

import { redirect } from "next/navigation";

//components
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/app-sidebar";

import { SiteHeader } from "@/components/site-header";

import { Toaster } from "@/components/ui/sonner";

type SidebarUser = {
    name: string;
    email: string;
    avatar?: string;
};


export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    const rawUserData = cookieStore.get("user-data")?.value;

    if (!token) {
        redirect("/login");
    }

    let sidebarUser: SidebarUser = {
        name: "Usuário",
        email: "",
        avatar: "/avatars/shadcn.jpg",
    };

    if (rawUserData) {
        try {
            const parsed = JSON.parse(decodeURIComponent(rawUserData)) as Partial<SidebarUser>;

            sidebarUser = {
                name: parsed.name ?? sidebarUser.name,
                email: parsed.email ?? sidebarUser.email,
                avatar: parsed.avatar ?? sidebarUser.avatar,
            };
        } catch {
            // fallback to defaults when cookie payload is malformed
        }
    }

    
return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" user={sidebarUser} />
            <SidebarInset>
                <SiteHeader />
                {children}
                <Toaster />
            </SidebarInset>
        </SidebarProvider>
    );
}