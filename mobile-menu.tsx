import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Menu, 
  X, 
  Stethoscope, 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  TrendingUp, 
  LineChart,
  Settings 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import UserProfile from "./user-profile";
import { useAuth } from "@/hooks/use-auth";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: ClipboardList, label: "Wound Assessment", path: "/assessment" },
    { icon: Users, label: "Patients", path: "/patients" },
    { icon: LineChart, label: "Healing Tracker", path: "/healing-tracker" },
    { icon: TrendingUp, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="bg-primary-dark text-white p-4 w-full md:hidden flex justify-between items-center">
        <div className="flex items-center">
          <Stethoscope className="h-5 w-5 mr-2" />
          <div>
            <h1 className="font-bold">Wound Care Team</h1>
            <div className="text-xs">King Faisal Medical Complex</div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-white">
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={cn(
        "fixed inset-0 bg-gray-900 bg-opacity-50 z-50 md:hidden transition-opacity",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div className={cn(
          "bg-primary-dark text-white w-64 h-full transition-transform",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-4 border-b border-blue-700 flex justify-between items-center">
            <div>
              <h1 className="font-bold">Wound Care Team</h1>
              <div className="text-xs">King Faisal Medical Complex</div>
            </div>
            <Button variant="ghost" size="icon" onClick={closeMenu} className="text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="mt-4">
            <ul>
              {navItems.map((item, index) => {
                const isActive = location === item.path;
                return (
                  <li key={index} className={cn(
                    "p-2 mx-2 rounded transition-colors",
                    isActive ? "bg-blue-600" : "hover:bg-blue-800 mt-1"
                  )}>
                    <Link 
                      href={item.path} 
                      className="flex items-center"
                      onClick={closeMenu}
                    >
                      <item.icon className="h-5 w-5 mr-2" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <UserProfile 
            name={user.fullName} 
            role={user.role}
            className="absolute bottom-0 w-64 border-t border-blue-700"
          />
        </div>
      </div>
    </>
  );
}
