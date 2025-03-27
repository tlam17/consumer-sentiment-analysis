"use client";

import { Settings, LogOut, ShoppingCart, ClipboardList, House } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
  } from "@/components/ui/sidebar"
  import { toast } from "sonner"
  import { useRouter } from "next/navigation";
  import { useUser } from "@/lib/UserContext";

// Menu items.
const items = [
    {
      title: "Home",
      url: "/dashboard/",
      icon: House,
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: ShoppingCart,
    },
    {
      title: "Reviews",
      url: "/dashboard/reviews",
      icon: ClipboardList,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ]

export function AppSidebar() {
    const router = useRouter();
    const { setUser } = useUser();

    const handleLogout = () => {
        // Set manual logout flag
        sessionStorage.setItem("manualLogout", "true");
        localStorage.removeItem("token");
        localStorage.removeItem("userData");

        setUser(null);
        
        router.push("/login");
        toast.success("You have been successfully logged out!");
    }

    return (
        <Sidebar className="sidebar-gradient text-sidebar-foreground border-r border-sidebar-border min-h-screen shadow-sm">
            <SidebarHeader className="px-4 py-5 border-b border-sidebar-border">
                <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
            </SidebarHeader>

            <SidebarContent className="px-2 py-4 space-y-2">
                <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu className="space-y-1">
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                        >
                            <a href={item.url} className="flex items-center gap-3 w-full">
                            <item.icon className="w-5 h-5" />
                            <span className="text-medium">{item.title}</span>
                            </a>
                        </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                    </SidebarMenu>
                </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="mt-auto px-4 py-3 border-t border-sidebar-border">
                <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-sm font-medium px-3 py-2 rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                    <LogOut className="w-5 h-5" />
                    <span>Log Out</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>

    );
}