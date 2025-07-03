import { KanbanHeader } from '@/components/KanbanHeader';
import { KanbanSidebar } from '@/components/KanbanSidebar';
import { KanbanBoard } from '@/components/KanbanBoard';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <KanbanHeader />
      <div className="flex h-[calc(100vh-73px)] md:h-[calc(100vh-85px)]">
        <KanbanSidebar />
        <main className="flex-1 overflow-auto w-full">
          <KanbanBoard />
        </main>
      </div>
    </div>
  );
};

export default Index;