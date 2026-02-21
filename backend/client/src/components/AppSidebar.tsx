import { LayoutDashboard, Building2, Car, Gauge, GitCompare, Newspaper, Users, MessageSquare, Headphones } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocation } from "wouter";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Brands",
    url: "/brands",
    icon: Building2,
  },
  {
    title: "Models",
    url: "/models",
    icon: Car,
  },
  {
    title: "Upcoming Cars",
    url: "/upcoming-cars",
    icon: Car,
  },
  {
    title: "Variants",
    url: "/variants",
    icon: Gauge,
  },
  {
    title: "Popular Comparison",
    url: "/popular-comparisons",
    icon: GitCompare,
  },
  {
    title: "News",
    url: "/news",
    icon: Newspaper,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Consultation Leads",
    url: "/leads",
    icon: Headphones,
  },
  {
    title: "Reviews",
    url: "/reviews",
    icon: MessageSquare,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`link-${item.title.toLowerCase()}`}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
