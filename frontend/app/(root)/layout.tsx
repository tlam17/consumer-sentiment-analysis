import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Header } from "@/components/Header"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1">
            {children}
          </main>
        </SidebarProvider>
      </div>
    </div>
  )
}
