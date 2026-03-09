'use client';

import { useEffect, useState } from 'react';

interface Event {
  id: string;
  timestamp: number;
  type: string;
  data: Record<string, unknown>;
}

function eventColor(type: string): string {
  if (type.includes('cancel') || type.includes('refund') || type.includes('failed') || type.includes('failure') || type.includes('overdue')) return 'text-red-400';
  if (type.includes('order') || type.includes('purchase')) return 'text-green-400';
  if (type.includes('subscription')) return 'text-cyan-400';
  return 'text-blue-400';
}

export default function EventLog() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events?limit=20');
        const result = await response.json();
        if (result.events && Array.isArray(result.events) && result.events.length > 0) {
          setEvents(result.events);
        }
      } catch {
        // keep existing events on fetch failure
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 px-4" id="webhooks">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <p className="text-cyan-400 font-semibold mb-1 uppercase tracking-wider text-sm">Live Activity</p>
          <h2 className="text-3xl font-bold text-white">Webhook event stream</h2>
          <p className="text-slate-400 text-sm mt-2">
            FastSpring fires real-time events for every billing action. This terminal shows them as they arrive.
          </p>
        </div>

        {/* Terminal */}
        <div className="rounded-xl overflow-hidden border border-slate-700/50 bg-slate-950">
          {/* Terminal bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-700/50">
            <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
            <span className="ml-3 text-slate-500 text-xs font-mono">POST /api/webhook · polling every 5s</span>
            <span className="ml-auto flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-green-400 text-xs font-mono">listening</span>
            </span>
          </div>

          {/* Log body */}
          <div className="p-5 font-mono text-xs leading-relaxed min-h-40 max-h-72 overflow-y-auto">
            {events.length === 0 ? (
              <div className="text-slate-600">
                <span className="text-slate-500">──</span>
                {'  '}Waiting for order events. Complete a purchase to see live webhook data here.
              </div>
            ) : (
              events.map((event) => (
                <div key={event.id} className="flex gap-4 mb-1 group">
                  <span className="text-slate-600 shrink-0">
                    {new Date(event.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                  </span>
                  <span className={`shrink-0 font-semibold ${eventColor(event.type)}`}>
                    [{event.type}]
                  </span>
                  <details className="text-slate-400 min-w-0">
                    <summary className="cursor-pointer hover:text-slate-200 truncate transition-colors">
                      {JSON.stringify(event.data).slice(0, 80)}…
                    </summary>
                    <pre className="mt-2 p-3 bg-slate-900 rounded text-slate-300 overflow-auto whitespace-pre-wrap">
                      {JSON.stringify(event.data, null, 2)}
                    </pre>
                  </details>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
