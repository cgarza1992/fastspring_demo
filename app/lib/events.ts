import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface WebhookEvent {
    id: string;
    timestamp: number;
    type: string;
    data: Record<string, unknown>;
}

const MAX_EVENTS = 100;

/**
 * Stores a new webhook event in the database
 */
export async function addEvent(type: string, data: Record<string, unknown>): Promise<WebhookEvent> {
  try {
    const event = await prisma.webhookEvent.create({
      data: {
        type,
        data,
      },
    });

    console.log('[EventStore] Added event:', type, 'ID:', event.id);
    return {
      id: event.id,
      timestamp: event.createdAt.getTime(),
      type: event.type,
      data: event.data as Record<string, unknown>,
    };
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
    const events = await prisma.webhookEvent.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: Math.min(limit, MAX_EVENTS),
    });

    const result = events.map(event => ({
      id: event.id,
      timestamp: event.createdAt.getTime(),
      type: event.type,
      data: event.data as Record<string, unknown>,
    }));

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
    const count = await prisma.webhookEvent.count();
    return count;
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
    const event = await prisma.webhookEvent.findUnique({
      where: { id },
    });

    if (!event) return undefined;

    return {
      id: event.id,
      timestamp: event.createdAt.getTime(),
      type: event.type,
      data: event.data as Record<string, unknown>,
    };
  } catch (error) {
    console.error('[EventStore] Error getting event by ID:', error);
    return undefined;
  }
}

/**
 * Clears all events from the database
 */
export async function clearEvents(): Promise<void> {
  try {
    await prisma.webhookEvent.deleteMany();
    console.log('[EventStore] All events cleared');
  } catch (error) {
    console.error('[EventStore] Error clearing events:', error);
  }
}