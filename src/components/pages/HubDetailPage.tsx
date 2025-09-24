import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHubContent } from '../../api/services/hub';
import { addBreathingSession, getTodoList, addTodoItem, toggleTodo, getProgress } from '../../api/services/progress';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';

export default function HubDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<any>(null);
  const [todos, setTodos] = useState<any[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        if (!id) return;
        const data = await getHubContent(id);
        setItem(data);
        const t = await getTodoList(id);
        setTodos(t.items || []);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load');
      }
    })();
  }, [id]);

  const handleBreathing = async () => {
    if (!id) return;
    await addBreathingSession(id);
  };

  const handleAddTodo = async () => {
    if (!id || !newTodo.trim()) return;
    const { item } = await addTodoItem(id, newTodo.trim());
    setTodos(prev => [...prev, item]);
    setNewTodo('');
  };

  const handleToggleTodo = async (todoId: string) => {
    if (!id) return;
    const { item } = await toggleTodo(id, todoId);
    setTodos(prev => prev.map(t => (t._id === item._id ? item : t)));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card/90 border-b border-border sticky top-0 z-40">
        <div className="px-4 py-4 flex items-center gap-3">
          <Link to="/hub">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="mm-text-h2 text-foreground">{item?.title || 'Hub Item'}</h1>
        </div>
      </header>

      <main className="px-4 py-6 pb-24 max-w-3xl mx-auto">
        {error && <div className="mm-error mb-4">{error}</div>}
        {item && (
          <Card className="mm-card mm-p-4 mb-6">
            {item.description && <p className="mm-text-body text-muted-foreground">{item.description}</p>}
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="mm-card mm-p-4">
            <h3 className="mm-text-h3 text-foreground mb-3">Breathing</h3>
            <Button className="mm-btn-primary" onClick={handleBreathing}>Add Breathing Session</Button>
          </Card>

          <Card className="mm-card mm-p-4">
            <h3 className="mm-text-h3 text-foreground mb-3">To-do</h3>
            <div className="flex gap-2 mb-3">
              <input className="mm-input" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Add a task" />
              <Button onClick={handleAddTodo} className="mm-btn-primary">Add</Button>
            </div>
            <ul className="space-y-2">
              {todos.map(t => (
                <li key={t._id} className="flex items-center justify-between">
                  <span className={t.completed ? 'line-through text-muted-foreground' : ''}>{t.text}</span>
                  <Button size="sm" variant="outline" onClick={() => handleToggleTodo(t._id)}>
                    {t.completed ? 'Undo' : 'Done'}
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
}
