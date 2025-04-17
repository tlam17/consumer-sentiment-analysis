import { SidebarProvider } from "@/components/ui/sidebar";
import { ReviewProvider } from "@/lib/ReviewContext";
import { AppSidebar } from "@/components/AppSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1">
          <SidebarProvider>
            <ReviewProvider>
              <AppSidebar />
              <main className="flex-1">
                {children}
              </main>
            </ReviewProvider>
          </SidebarProvider>
        </div>
      </div>
    </ProtectedRoute>
  )
}
