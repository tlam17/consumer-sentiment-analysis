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

// Menu items.
const items = [
    {
      title: "Home",
      url: "/",
      icon: House,
    },
    {
      title: "Products",
      url: "/products",
      icon: ShoppingCart,
    },
    {
      title: "Reviews",
      url: "/reviews",
      icon: ClipboardList,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ]

export function AppSidebar() {
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
                        <SidebarMenuButton asChild>
                            <a href="#">
                                <LogOut/>
                                <span>Logout</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}