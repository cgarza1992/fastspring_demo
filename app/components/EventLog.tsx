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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events?limit=20');
        const result = await response.json();
        // Only update if we actually got events back - don't wipe out state on empty response
        if (result.events && Array.isArray(result.events)) {
          setEvents(result.events);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
        // Keep existing events on fetch failure
      }
    };

    // Fetch immediately on mount
    fetchEvents();

    // Then poll every 5 seconds
    const interval = setInterval(fetchEvents, 5000);
    
    return () => clearInterval(interval);
  }, []);

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
