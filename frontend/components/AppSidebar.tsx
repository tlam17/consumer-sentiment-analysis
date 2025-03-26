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
        <Sidebar>
            <SidebarHeader>
                <h1>Dashboard</h1>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon/>
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center gap-2">
                            <SidebarMenuButton onClick={handleLogout}>
                                <LogOut/>
                                <span>Log Out</span>
                            </SidebarMenuButton>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}