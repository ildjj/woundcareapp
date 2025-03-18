import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface UserProfileProps {
  name: string;
  role: string;
  className?: string;
}

export default function UserProfile({ name, role, className }: UserProfileProps) {
  const { logoutMutation } = useAuth();
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className={cn("p-4", className)}>
      <div className="flex items-center">
        <Avatar className="h-8 w-8 bg-white text-primary-dark mr-2">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs opacity-75">{role}</div>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        className="mt-2 text-sm flex items-center text-blue-200 hover:text-white"
        onClick={() => logoutMutation.mutate()}
      >
        <LogOut className="h-4 w-4 mr-1" />
        Logout
      </Button>
    </div>
  );
}
