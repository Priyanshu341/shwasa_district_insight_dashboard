
// import React from 'react';
// import { ThemeToggle } from '@/components/theme-toggle';
// import { useTheme } from '@/components/theme-provider';

// const DashboardHeader = () => {
//   const { theme } = useTheme();
  
//   // Determine which logo to use based on theme
//   const logoSrc = theme === 'dark' 
//     ? "/lovable-uploads/ddd12866-9431-46f6-99c2-fd566296ec4d.png" 
//     : "/lovable-uploads/8b89ebd7-ce8b-4059-aa31-d622e16c64a5.png";

//   return (
//     <header className="bg-background/60 backdrop-blur-xl border-b border-border/40 sticky top-0 z-10 animate-fade-in">
//       <div className="container mx-auto px-4 h-16 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="h-10 w-10 overflow-hidden transition-all duration-300">
//             <img 
//               src={logoSrc} 
//               alt="SETV Logo" 
//               className="h-full w-full object-contain transition-opacity duration-300"
//             />
//           </div>
//           <div>
//             <h1 className="font-semibold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">SHWĀSA District Health Monitoring Dashboard</h1>
//             <p className="text-xs text-muted-foreground">Powered by SETV</p>
//           </div>
//         </div>
        
//         <div className="flex items-center gap-4">
//           <ThemeToggle />
//           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-white/10 shadow-sm">
//             <span className="text-foreground font-medium">AD</span>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default DashboardHeader;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/theme-toggle';
import { useTheme } from '@/components/theme-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';

const DashboardHeader = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Determine which logo to use based on theme
  const logoSrc = theme === 'dark'
    ? "/lovable-uploads/ddd12866-9431-46f6-99c2-fd566296ec4d.png"
    : "/lovable-uploads/8b89ebd7-ce8b-4059-aa31-d622e16c64a5.png";

  const handleLogout = () => {
    // Clear the admin login status
    localStorage.removeItem('isAdminLoggedIn');
    // Redirect to login page
    navigate('/login');
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-background/60 backdrop-blur-xl border-b border-border/40 sticky top-0 z-10 animate-fade-in">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden transition-all duration-300">
            <img
              src={logoSrc}
              alt="SETV Logo"
              className="h-full w-full object-contain transition-opacity duration-300"
            />
          </div>
          <div>
            <h1 className="font-semibold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              SHWĀSA District Health Monitoring Dashboard
            </h1>
            <p className="text-xs text-muted-foreground">Powered by SETV</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <div
                className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-white/10 shadow-sm cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="text-foreground font-medium">AD</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mt-2">
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;