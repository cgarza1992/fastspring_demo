import { randomUUID } from "crypto";

interface WebhookEvent {
    id: string;
    timestamp: number;
    type: string;
    data: Record<string, unknown>;
}

let events: WebhookEvent[] = [];
const MAX_EVENTS = 100;

/**
 * Stores a new webhook event in memory
 * @param type - The webhook event type (e.g., "order.completed", "subscription.activated")
 * @param data - The webhook payload/data object
 * @returns The stored WebhookEvent object with generated ID and timestamp
 */
export function addEvent(type: string, data: Record<string, unknown>): WebhookEvent {
  // Generate unique ID using crypto
  const id = randomUUID();

  // Create event object with metadata
  const event: WebhookEvent = {
    id,
    timestamp: Date.now(),
    type,
    data,
  };

  // Add to beginning so newest events are first
  events.unshift(event);

  // Maintain max size limit by removing oldest events
  if (events.length > MAX_EVENTS) {
    events = events.slice(0, MAX_EVENTS);
  }

  return event;
}

/**
 * Retrieves the most recent webhook events
 * @param limit - Maximum number of events to return (default: 50, max: 100)
 * @returns Array of WebhookEvent objects, newest first
 */
export function getEvents( limit: number = 50): WebhookEvent[] {
    // Return items from 0 up to our designated limit.
    return events.slice(0, limit );
}

/**
 * Gets the total number of stored webhook events
 * @returns Number of events currently in memory
 */
export function getEventCount(): number {
    // Return total count
    return events.length;
}

/**
 * Finds a specific webhook event by its ID
 * @param id - The unique event ID to search for
 * @returns The WebhookEvent if found, undefined otherwise
 */
export function getEventById(id: string): WebhookEvent | undefined {
    // Find event by ID
    return events.find( e => e.id === id );
}