import { Home, Thermometer, Settings, Zap, ArrowUpDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Home",
    icon: Home,
    url: "/",
  },
  {
    title: "Environmental Temperature",
    icon: Thermometer,
    url: "/environmental-temperature",
  },
  {
    title: "Preventive Maintenance",
    icon: Settings,
    url: "/preventive-maintenance",
  },
  {
    title: "Migration Advice",
    icon: ArrowUpDown,
    url: "/migration-advice",
  },
  {
    title: "Stress Testing",
    icon: Zap,
    url: "/stress-testing",
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-[#ebe9f1]">
      <SidebarHeader className="p-6 bg-[#028a4a]">
        <div className="flex items-center space-x-3">
          <div className="text-white">
            <h2 className="font-bold text-lg font-montserrat">B'GREEN</h2>
            <p className="text-xs text-green-100">Monitor System</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupContent className="px-3 py-4">
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={`
                        w-full justify-start px-4 py-3 mb-1 rounded-lg text-sm font-medium font-montserrat transition-all duration-200
                        ${isActive 
                          ? 'bg-[#028a4a] text-white hover:bg-[#026d3c]' 
                          : 'text-[#6e6b7b] hover:bg-[#f8f8f8] hover:text-[#028a4a]'
                        }
                      `}
                    >
                      <Link to={item.url} className="flex items-center space-x-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
