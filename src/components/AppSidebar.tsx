import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Settings, 
  Moon, 
  Sun,
  Home,
  PieChart
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const navigationItems = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'Polls', url: '/polls', icon: BarChart3 },
  { title: 'Analytics', url: '/analytics', icon: TrendingUp },
  { title: 'Community', url: '/community', icon: Users },
];

const settingsItems = [
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? 'bg-primary/10 text-primary font-medium border-r-2 border-primary' 
      : 'hover:bg-muted/50 hover:text-foreground transition-all duration-200';

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Sidebar
      className={cn(
        'border-r border-border/40 bg-gradient-to-b from-card to-card/50 backdrop-blur-sm',
        !open ? 'w-14' : 'w-64'
      )}
    >
      <SidebarContent className="p-2">
        {/* Logo/Brand Section */}
        {open && (
          <div className="px-4 py-6 border-b border-border/20 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <PieChart className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="animate-fade-in">
                <h2 className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
                  PollSystem
                </h2>
                <p className="text-xs text-muted-foreground">Interactive Polls</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            'text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2',
            !open && 'text-center'
          )}>
            {!open ? '•' : 'Navigation'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group',
                        getNavCls({ isActive })
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                      {open && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Theme Toggle */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className={cn(
            'text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2',
            !open && 'text-center'
          )}>
            {!open ? '•' : 'Appearance'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2">
              <Button
                variant="ghost"
                size={!open ? "icon" : "sm"}
                onClick={toggleTheme}
                className={cn(
                  'w-full justify-start gap-3 hover:bg-muted/50 transition-all duration-200 group',
                  !open && 'justify-center px-0'
                )}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                ) : (
                  <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-300" />
                )}
                {open && (
                  <span className="font-medium">
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </span>
                )}
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group',
                        getNavCls({ isActive })
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0 group-hover:rotate-12 transition-transform duration-200" />
                      {open && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
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