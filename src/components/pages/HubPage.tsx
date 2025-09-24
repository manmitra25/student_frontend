import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listHubContent, HubContent } from '../../api/services/hub';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';

export default function HubPage() {
  const [items, setItems] = useState<HubContent[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await listHubContent();
        setItems(data || []);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load content');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card/90 border-b border-border sticky top-0 z-40">
        <div className="px-4 py-4 flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="mm-text-h2 text-foreground">Psychoeducational Hub</h1>
        </div>
      </header>

      <main className="px-4 py-6 pb-24">
        {loading && <p className="text-muted-foreground">Loading...</p>}
        {error && <div className="mm-error mb-4">{error}</div>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <Card key={item._id} className="mm-card mm-p-4">
              <h3 className="mm-text-h3 text-foreground mb-2">{item.title}</h3>
              {item.description && (
                <p className="mm-text-small text-muted-foreground mb-3">{item.description}</p>
              )}
              <Link to={`/hub/${item._id}`}>
                <Button className="mm-btn-primary">View</Button>
              </Link>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
