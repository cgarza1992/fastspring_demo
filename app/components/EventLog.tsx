'use client';

import { useEffect, useState } from 'react';

interface Event {
  id: string;
  timestamp: number;
  type: string;
  data: Record<string, unknown>;
}

export default function EventLog() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events?limit=20');
        const result = await response.json();
        setEvents(result.events);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Loading events...</div>;
  }

  return (
    <section className="py-12 px-4 bg-slate-900/50 border border-slate-800 rounded-lg">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-white">Webhook Events</h2>
        
        {events.length === 0 ? (
          <p className="text-gray-400">No events yet. Make a purchase to trigger a webhook.</p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-cyan-400">{event.type}</span>
                  <span className="text-sm text-gray-400">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <details className="text-sm text-gray-300">
                  <summary className="cursor-pointer hover:text-white">View data</summary>
                  <pre className="mt-2 p-2 bg-slate-950 rounded text-xs overflow-auto">
                    {JSON.stringify(event.data, null, 2)}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
