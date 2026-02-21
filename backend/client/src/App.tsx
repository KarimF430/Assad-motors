import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import { ModelFormProvider } from "@/contexts/ModelFormContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import BrandList from "@/pages/BrandList";
import BrandForm from "@/pages/BrandForm";
import ModelList from "@/pages/ModelList";
import ModelFormPage1 from "@/pages/ModelFormPage1";
import ModelFormPage2 from "@/pages/ModelFormPage2";
import ModelFormPage3 from "@/pages/ModelFormPage3";
import ModelFormPage4 from "@/pages/ModelFormPage4";
import VariantList from "@/pages/VariantList";
import VariantFormPage1 from "@/pages/VariantFormPage1";
import VariantFormPage2 from "@/pages/VariantFormPage2";
import VariantFormPage3 from "@/pages/VariantFormPage3";
import VariantFormPage4 from "@/pages/VariantFormPage4";
import VariantFormPage5 from "@/pages/VariantFormPage5";
import PopularComparisons from "@/pages/PopularComparisons";
import News from "@/pages/News";
import NewsForm from "@/pages/NewsForm";
import Users from "@/pages/Users";
import Leads from "@/pages/Leads";
import Reviews from "@/pages/Reviews";
import NotFound from "@/pages/not-found";
import UpcomingCarList from "@/pages/UpcomingCarList";
import UpcomingCarFormPage1 from "@/pages/UpcomingCarFormPage1";
import UpcomingCarFormPage2 from "@/pages/UpcomingCarFormPage2";
import UpcomingCarFormPage3 from "@/pages/UpcomingCarFormPage3";
import UpcomingCarFormPage4 from "@/pages/UpcomingCarFormPage4";
import { UpcomingCarFormProvider } from "@/contexts/UpcomingCarFormContext";

function Router() {
  return (
    <Switch>
      {/* Public route */}
      <Route path="/login" component={Login} />

      {/* Protected routes */}
      <Route path="/">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/brands">
        <ProtectedRoute>
          <BrandList />
        </ProtectedRoute>
      </Route>
      <Route path="/brands/new">
        <ProtectedRoute>
          <BrandForm />
        </ProtectedRoute>
      </Route>
      <Route path="/brands/:id/edit">
        <ProtectedRoute>
          <BrandForm />
        </ProtectedRoute>
      </Route>
      <Route path="/models">
        <ProtectedRoute>
          <ModelList />
        </ProtectedRoute>
      </Route>
      <Route path="/models/new">
        <ProtectedRoute>
          <ModelFormPage1 />
        </ProtectedRoute>
      </Route>
      <Route path="/models/new/page2">
        <ProtectedRoute>
          <ModelFormPage2 />
        </ProtectedRoute>
      </Route>
      <Route path="/models/new/page3">
        <ProtectedRoute>
          <ModelFormPage3 />
        </ProtectedRoute>
      </Route>
      <Route path="/models/new/page4">
        <ProtectedRoute>
          <ModelFormPage4 />
        </ProtectedRoute>
      </Route>
      <Route path="/models/:id/edit">
        <ProtectedRoute>
          <ModelFormPage1 />
        </ProtectedRoute>
      </Route>
      <Route path="/models/:id/edit/page2">
        <ProtectedRoute>
          <ModelFormPage2 />
        </ProtectedRoute>
      </Route>
      <Route path="/models/:id/edit/page3">
        <ProtectedRoute>
          <ModelFormPage3 />
        </ProtectedRoute>
      </Route>
      <Route path="/models/:id/edit/page4">
        <ProtectedRoute>
          <ModelFormPage4 />
        </ProtectedRoute>
      </Route>
      <Route path="/upcoming-cars">
        <ProtectedRoute>
          <UpcomingCarList />
        </ProtectedRoute>
      </Route>
      <Route path="/upcoming-cars/new">
        <ProtectedRoute>
          <UpcomingCarFormPage1 />
        </ProtectedRoute>
      </Route>
      <Route path="/upcoming-cars/new/page2">
        <ProtectedRoute>
          <UpcomingCarFormPage2 />
        </ProtectedRoute>
      </Route>
      <Route path="/upcoming-cars/new/page3">
        <ProtectedRoute>
          <UpcomingCarFormPage3 />
        </ProtectedRoute>
      </Route>
      <Route path="/upcoming-cars/new/page4">
        <ProtectedRoute>
          <UpcomingCarFormPage4 />
        </ProtectedRoute>
      </Route>
      <Route path="/upcoming-cars/:id/edit">
        <ProtectedRoute>
          <UpcomingCarFormPage1 />
        </ProtectedRoute>
      </Route>
      <Route path="/upcoming-cars/:id/edit/page2">
        <ProtectedRoute>
          <UpcomingCarFormPage2 />
        </ProtectedRoute>
      </Route>
      <Route path="/upcoming-cars/:id/edit/page3">
        <ProtectedRoute>
          <UpcomingCarFormPage3 />
        </ProtectedRoute>
      </Route>
      <Route path="/upcoming-cars/:id/edit/page4">
        <ProtectedRoute>
          <UpcomingCarFormPage4 />
        </ProtectedRoute>
      </Route>
      <Route path="/variants">
        <ProtectedRoute>
          <VariantList />
        </ProtectedRoute>
      </Route>
      <Route path="/variants/new">
        <ProtectedRoute>
          <VariantFormPage1 />
        </ProtectedRoute>
      </Route>
      <Route path="/variants/new/page2">
        <ProtectedRoute>
          <VariantFormPage2 />
        </ProtectedRoute>
      </Route>
      <Route path="/variants/new/page3">
        <ProtectedRoute>
          <VariantFormPage3 />
        </ProtectedRoute>
      </Route>
      <Route path="/variants/new/page4">
        <ProtectedRoute>
          <VariantFormPage4 />
        </ProtectedRoute>
      </Route>
      <Route path="/variants/new/page5">
        <ProtectedRoute>
          <VariantFormPage5 />
        </ProtectedRoute>
      </Route>
      <Route path="/variants/:id/edit">
        <ProtectedRoute>
          <VariantFormPage1 />
        </ProtectedRoute>
      </Route>
      <Route path="/variants/:id/edit/page2">
        <ProtectedRoute>
          <VariantFormPage2 />
        </ProtectedRoute>
      </Route>
      <Route path="/variants/:id/edit/page3">
        <ProtectedRoute>
          <VariantFormPage3 />
        </ProtectedRoute>
      </Route>
      <Route path="/variants/:id/edit/page4">
        <ProtectedRoute>
          <VariantFormPage4 />
        </ProtectedRoute>
      </Route>
      <Route path="/variants/:id/edit/page5">
        <ProtectedRoute>
          <VariantFormPage5 />
        </ProtectedRoute>
      </Route>
      <Route path="/popular-comparisons">
        <ProtectedRoute>
          <PopularComparisons />
        </ProtectedRoute>
      </Route>
      <Route path="/news">
        <ProtectedRoute>
          <News />
        </ProtectedRoute>
      </Route>
      <Route path="/news/new">
        <ProtectedRoute>
          <NewsForm />
        </ProtectedRoute>
      </Route>
      <Route path="/news/:id/edit">
        <ProtectedRoute>
          <NewsForm />
        </ProtectedRoute>
      </Route>
      <Route path="/users">
        <ProtectedRoute>
          <Users />
        </ProtectedRoute>
      </Route>
      <Route path="/leads">
        <ProtectedRoute>
          <Leads />
        </ProtectedRoute>
      </Route>
      <Route path="/reviews">
        <ProtectedRoute>
          <Reviews />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <ModelFormProvider>
            <UpcomingCarFormProvider>
              <SidebarProvider>
                <div className="flex h-screen w-full">
                  <AppSidebar />
                  <div className="flex flex-col flex-1">
                    <AppHeader />
                    <main className="flex-1 overflow-auto">
                      <Router />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
              <Toaster />
            </UpcomingCarFormProvider>
          </ModelFormProvider>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
