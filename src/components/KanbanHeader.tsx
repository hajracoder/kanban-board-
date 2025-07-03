import { Search, Share, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function KanbanHeader() {
  return (
    <header className="bg-background border-b border-border px-3 sm:px-6 py-3">
      <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-3 sm:gap-0">
        <div className="flex items-center">
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Kanban</h1>
        </div>
        
        <div className="flex-1 w-full sm:max-w-md sm:mx-8 order-3 sm:order-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Try searching tasks..." 
              className="pl-10 w-full bg-muted/50 border-border"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 order-2 sm:order-3">
          <Button variant="default" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Share className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}