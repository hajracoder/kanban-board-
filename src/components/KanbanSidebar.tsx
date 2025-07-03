import { FileText, Settings, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function KanbanSidebar() {
  const navigationItems = [
    { icon: LayoutDashboard, label: 'Boards', active: true },
    { icon: FileText, label: 'Pages', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <aside className="hidden md:block w-48 lg:w-64 bg-kanban-sidebar border-r border-border px-3 lg:px-4 py-6">
      <div className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.label}
              variant={item.active ? "secondary" : "ghost"}
              className={`w-full justify-start text-sm ${
                item.active 
                  ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </aside>
  );
}