import { randomUUID } from "crypto";

interface WebhookEvent {
    id: string;
    timestamp: number;
    type: string;
    data: Record<string, unknown>;
}

const MAX_EVENTS = 100;

// Fallback in-memory storage for local development
let localEvents: WebhookEvent[] = [];

// Use Vercel KV on production, fallback to in-memory locally
let kvAvailable = false;
let kv: any = null;

// Try to import KV at runtime
(async () => {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const kvModule = await import('@vercel/kv');
      kv = kvModule.kv;
      kvAvailable = true;
      console.log('[EventStore] Using Vercel KV for persistence');
    } else {
      console.log('[EventStore] KV not configured, using in-memory storage (local dev)');
    }
  } catch (error) {
    console.log('[EventStore] KV import failed, using in-memory storage');
  }
})();

const EVENTS_KEY = 'webhook:events';

/**
 * Stores a new webhook event in KV or in-memory storage
 */
export async function addEvent(type: string, data: Record<string, unknown>): Promise<WebhookEvent> {
  try {
    const id = randomUUID();
    const event: WebhookEvent = {
      id,
      timestamp: Date.now(),
      type,
      data,
    };

    if (kvAvailable && kv) {
      // Use Vercel KV on production
      const currentEventsJson = await kv.get(EVENTS_KEY);
      const currentEvents: WebhookEvent[] = currentEventsJson ? JSON.parse(currentEventsJson as string) : [];
      currentEvents.unshift(event);
      
      if (currentEvents.length > MAX_EVENTS) {
        currentEvents.splice(MAX_EVENTS);
      }
      
      await kv.set(EVENTS_KEY, JSON.stringify(currentEvents));
      console.log('[EventStore] (KV) Added event:', type, 'Total events now:', currentEvents.length);
    } else {
      // Use in-memory storage locally
      localEvents.unshift(event);
      if (localEvents.length > MAX_EVENTS) {
        localEvents.splice(MAX_EVENTS);
      }
      console.log('[EventStore] (Memory) Added event:', type, 'Total events now:', localEvents.length);
    }

    return event;
  } catch (error) {
    console.error('[EventStore] Error adding event:', error);
    throw error;
  }
}

/**
 * Retrieves the most recent webhook events
 */
export async function getEvents(limit: number = 50): Promise<WebhookEvent[]> {
  try {
    let events: WebhookEvent[] = [];

    if (kvAvailable && kv) {
      // Fetch from Vercel KV
      const eventsJson = await kv.get(EVENTS_KEY);
      events = eventsJson ? JSON.parse(eventsJson as string) : [];
    } else {
      // Use in-memory storage
      events = localEvents;
    }

    const result = events.slice(0, Math.min(limit, MAX_EVENTS));
    console.log('[EventStore] getEvents - Total stored:', events.length, 'Returning:', result.length);
    return result;
  } catch (error) {
    console.error('[EventStore] Error getting events:', error);
    return [];
  }
}

/**
 * Gets the total number of stored webhook events
 */
export async function getEventCount(): Promise<number> {
  try {
    if (kvAvailable && kv) {
      const eventsJson = await kv.get(EVENTS_KEY);
      const events: WebhookEvent[] = eventsJson ? JSON.parse(eventsJson as string) : [];
      return events.length;
    } else {
      return localEvents.length;
    }
  } catch (error) {
    console.error('[EventStore] Error getting event count:', error);
    return 0;
  }
}

/**
 * Finds a specific webhook event by its ID
 */
export async function getEventById(id: string): Promise<WebhookEvent | undefined> {
  try {
    let events: WebhookEvent[] = [];

    if (kvAvailable && kv) {
      const eventsJson = await kv.get(EVENTS_KEY);
      events = eventsJson ? JSON.parse(eventsJson as string) : [];
    } else {
      events = localEvents;
    }

    return events.find(e => e.id === id);
  } catch (error) {
    console.error('[EventStore] Error getting event by ID:', error);
    return undefined;
  }
}

/**
 * Clears all events from storage
 */
export async function clearEvents(): Promise<void> {
  try {
    if (kvAvailable && kv) {
      await kv.del(EVENTS_KEY);
      console.log('[EventStore] (KV) All events cleared');
    } else {
      localEvents = [];
      console.log('[EventStore] (Memory) All events cleared');
    }
  } catch (error) {
    console.error('[EventStore] Error clearing events:', error);
  }
}