'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Upload, FileText, CheckCircle2, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutGrid,
    description: 'View all cases',
  },
  {
    label: 'New Screening',
    href: '/screening',
    icon: Upload,
    description: 'Upload retina image',
  },
  {
    label: 'Cases',
    href: '/dashboard',
    icon: Activity,
    description: 'Manage cases',
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: FileText,
    description: 'View reports',
  },
  {
    label: 'Resolved',
    href: '/resolved',
    icon: CheckCircle2,
    description: 'Completed cases',
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border/30 bg-gradient-to-b from-sidebar to-sidebar/80 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border/20">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center group-hover:shadow-lg transition-shadow">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-sidebar-foreground">DR Screen</h1>
            <p className="text-xs text-sidebar-foreground/60">Detection System</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href === '/dashboard' && pathname.startsWith('/cases'));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-sidebar-primary/20 text-sidebar-foreground font-medium'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-primary/10'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-xs opacity-70 truncate">{item.description}</p>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-border/20 bg-sidebar-primary/5">
        <p className="text-xs text-sidebar-foreground/60">
          AI-powered diabetic retinopathy screening and diagnosis system
        </p>
      </div>
    </aside>
  );
}
