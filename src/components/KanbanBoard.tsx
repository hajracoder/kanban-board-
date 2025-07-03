import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export interface KanbanCard {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'progress' | 'done';
  createdAt: Date;
  position: number;
}

const STORAGE_KEY = 'kanban-cards';

export function KanbanBoard() {
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [dragOverPosition, setDragOverPosition] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');

  // Load cards from localStorage on mount
  useEffect(() => {
    const savedCards = localStorage.getItem(STORAGE_KEY);
    if (savedCards) {
      const parsedCards = JSON.parse(savedCards).map((card: any) => ({
        ...card,
        createdAt: new Date(card.createdAt)
      }));
      setCards(parsedCards);
    } else {
      // Initialize with default cards
      const defaultCards: KanbanCard[] = [
        {
          id: '1',
          title: 'Design landing page for support team',
          description: 'Create a comprehensive landing page with modern design principles',
          status: 'todo',
          createdAt: new Date('2024-01-15T10:30:00'),
          position: 0
        },
        {
          id: '2',
          title: 'Update navigation',
          description: 'Implement new navigation structure based on user feedback',
          status: 'todo',
          createdAt: new Date('2024-01-15T11:00:00'),
          position: 1
        },
        {
          id: '3',
          title: 'Create wireframe for next page',
          description: 'Design wireframes for the upcoming feature page',
          status: 'progress',
          createdAt: new Date('2024-01-15T09:45:00'),
          position: 0
        },
        {
          id: '4',
          title: 'Research for solve problem in smooth way',
          description: 'Conduct thorough research to identify optimal solutions',
          status: 'progress',
          createdAt: new Date('2024-01-15T14:20:00'),
          position: 1
        },
        {
          id: '5',
          title: 'Grow email list',
          description: 'Implement strategies to increase newsletter subscriptions',
          status: 'done',
          createdAt: new Date('2024-01-14T16:15:00'),
          position: 0
        },
        {
          id: '6',
          title: 'Provide visitors a personalized experience',
          description: 'Develop personalization features for better user engagement',
          status: 'done',
          createdAt: new Date('2024-01-14T13:30:00'),
          position: 1
        }
      ];
      setCards(defaultCards);
    }
  }, []);

  // Save cards to localStorage whenever cards change
  useEffect(() => {
    if (cards.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    }
  }, [cards]);

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    setDraggedCard(cardId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, targetPosition: number) => {
    e.preventDefault();
    setDragOverPosition(targetPosition);
  };

  const handleDrop = (e: React.DragEvent, newStatus: 'todo' | 'progress' | 'done', dropPosition?: number) => {
    e.preventDefault();
    if (draggedCard) {
      setCards(prevCards => {
        const draggedCardData = prevCards.find(card => card.id === draggedCard);
        if (!draggedCardData) return prevCards;

        const cardsInTargetColumn = prevCards.filter(card => card.status === newStatus && card.id !== draggedCard);
        const finalPosition = dropPosition ?? cardsInTargetColumn.length;

        // Update positions for cards in target column
        const updatedCards = prevCards.map(card => {
          if (card.id === draggedCard) {
            return { ...card, status: newStatus, position: finalPosition };
          }
          if (card.status === newStatus && card.position >= finalPosition) {
            return { ...card, position: card.position + 1 };
          }
          return card;
        });

        // Reorder positions in the target column
        const targetColumnCards = updatedCards
          .filter(card => card.status === newStatus)
          .sort((a, b) => a.position - b.position);

        return updatedCards.map(card => {
          if (card.status === newStatus) {
            const newPosition = targetColumnCards.findIndex(c => c.id === card.id);
            return { ...card, position: newPosition };
          }
          return card;
        });
      });
      setDraggedCard(null);
      setDragOverPosition(null);
    }
  };

  const handleCreateCard = () => {
    if (newCardTitle.trim()) {
      const todoCards = cards.filter(card => card.status === 'todo');
      const maxPosition = todoCards.length > 0 ? Math.max(...todoCards.map(card => card.position)) : -1;
      
      const newCard: KanbanCard = {
        id: Date.now().toString(),
        title: newCardTitle,
        description: newCardDescription,
        status: 'todo',
        createdAt: new Date(),
        position: maxPosition + 1
      };
      setCards(prevCards => [...prevCards, newCard]);
      setNewCardTitle('');
      setNewCardDescription('');
      setIsDialogOpen(false);
    }
  };

  const getColumnCards = (status: 'todo' | 'progress' | 'done') => {
    return cards
      .filter(card => card.status === status)
      .sort((a, b) => a.position - b.position);
  };

  const getColumnColor = (status: 'todo' | 'progress' | 'done') => {
    switch (status) {
      case 'todo':
        return 'border-l-kanban-todo';
      case 'progress':
        return 'border-l-kanban-progress';
      case 'done':
        return 'border-l-kanban-done';
      default:
        return 'border-l-gray-300';
    }
  };

  const getColumnTitle = (status: 'todo' | 'progress' | 'done') => {
    switch (status) {
      case 'todo':
        return 'To-do';
      case 'progress':
        return 'In-progress';
      case 'done':
        return 'Done';
      default:
        return '';
    }
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const renderColumn = (status: 'todo' | 'progress' | 'done') => {
    const columnCards = getColumnCards(status);
    
    return (
      <div
        className="flex-1 bg-kanban-column rounded-lg p-3 sm:p-4 min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, status)}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">{getColumnTitle(status)}</h3>
          {status === 'todo' && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-accent"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Card</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newCardTitle}
                      onChange={(e) => setNewCardTitle(e.target.value)}
                      placeholder="Enter card title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newCardDescription}
                      onChange={(e) => setNewCardDescription(e.target.value)}
                      placeholder="Enter card description"
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleCreateCard} className="w-full">
                    Create Card
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <div className="space-y-3">
          {columnCards.map((card, index) => (
            <Card
              key={card.id}
              className={`cursor-move hover:shadow-md transition-shadow bg-kanban-card border-l-4 ${getColumnColor(status)} ${
                draggedCard === card.id ? 'opacity-50' : ''
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, card.id)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDrop={(e) => handleDrop(e, status, index)}
            >
              <CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
                <CardTitle className="text-sm sm:text-base font-medium leading-tight">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2 p-3 sm:p-6 sm:pt-0">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
                <div className="text-xs text-muted-foreground border-t border-border pt-2">
                  {formatDateTime(card.createdAt)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-3 sm:gap-6 p-3 sm:p-6 bg-background min-h-full">
      {renderColumn('todo')}
      {renderColumn('progress')}
      {renderColumn('done')}
    </div>
  );
}