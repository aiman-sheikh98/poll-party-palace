import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import Polls from "./pages/Polls";
import Analytics from "./pages/Analytics";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              {/* Global header with sidebar trigger */}
              <header className="fixed top-0 left-0 right-0 h-12 flex items-center bg-background/80 backdrop-blur-sm border-b border-border/40 z-50">
                <SidebarTrigger className="ml-4" />
                <div className="flex-1 text-center">
                  <h1 className="text-sm font-semibold bg-gradient-primary bg-clip-text text-transparent">
                    Interactive Poll System
                  </h1>
                </div>
              </header>

              {/* Sidebar */}
              <AppSidebar />

              {/* Main content */}
              <main className="flex-1 pt-12">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/polls" element={<Polls />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/settings" element={<div className="p-8 text-center text-muted-foreground">Settings coming soon...</div>} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
