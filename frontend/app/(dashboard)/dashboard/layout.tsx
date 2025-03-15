import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Header } from "@/components/Header"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1">
          <SidebarProvider>
            <AppSidebar />
            <main className="flex-1">
              {children}
            </main>
          </SidebarProvider>
        </div>
      </div>
    </ProtectedRoute>
  )
}
