import type { Item } from './types'; //match names with the backend model

const BASE_URL = 'http://localhost:3000/api/items';

// Fetches active items.
export async function getItems(): Promise<Item[]> {
  const res = await fetch(BASE_URL, { cache: 'no-store' });
  return res.json();
}

// Fetches archived items.
export async function getArchivedItems(): Promise<Item[]> {
  const res = await fetch(`${BASE_URL}?archived=true`, { cache: 'no-store' }); //archived items query
  return res.json();
}

// Creates a new item. Returns the response itself (not just the JSON),
// so the caller can check res.ok and read the error body if it failed.
export async function createItem(data: {
  name: string;
  priceCents: number;
  quantity: number;
}): Promise<Response> {
  return fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// Updates an item's quantity.
export async function updateQuantity(id: string, quantity: number): Promise<Response> {
  return fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
}

// Archives an item.
export async function archiveItem(id: string): Promise<Response> {
  return fetch(`${BASE_URL}/${id}/archive`, { method: 'PATCH' });
}

// Unarchives an item.
export async function unarchiveItem(id: string): Promise<Response> {
  return fetch(`${BASE_URL}/${id}/unarchive`, { method: 'PATCH' });
}