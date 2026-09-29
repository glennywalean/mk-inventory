import type { Item } from './types'; //match names with the backend model

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/items`;
type AccessTokenGetter = () => Promise<string | undefined>;

async function apiFetch(
  url: string,
  getAccessToken: AccessTokenGetter,
  options: RequestInit = {}
): Promise<Response> {
  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error('An access token is required to call the inventory API.');

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${accessToken}`);

  return fetch(url, {
    ...options,
    headers,
    cache: options.cache ?? 'no-store',
  });
}

// Fetches active items.
export async function getItems(getAccessToken: AccessTokenGetter): Promise<Item[]> {
  const res = await apiFetch(BASE_URL, getAccessToken);
  return res.json();
}

// Fetches archived items.
export async function getArchivedItems(getAccessToken: AccessTokenGetter): Promise<Item[]> {
  const res = await apiFetch(`${BASE_URL}?archived=true`, getAccessToken); //archived items query
  return res.json();
}

// Creates a new item. Returns the response itself (not just the JSON),
// so the caller can check res.ok and read the error body if it failed.
export async function createItem(data: {
  name: string;
  priceCents: number;
  quantity: number;
}, getAccessToken: AccessTokenGetter): Promise<Response> {
  return apiFetch(BASE_URL, getAccessToken, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// Updates an item's quantity.
export async function updateQuantity(
  id: string,
  quantity: number,
  getAccessToken: AccessTokenGetter
): Promise<Response> {
  return apiFetch(`${BASE_URL}/${id}`, getAccessToken, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
}

// update name, price.
export async function updateItem(
  id: string,
  data: { name: string; priceCents: number },
  getAccessToken: AccessTokenGetter
): Promise<Response> {
  return apiFetch(`${BASE_URL}/${id}`, getAccessToken, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// Archives an item.
export async function archiveItem(
  id: string,
  getAccessToken: AccessTokenGetter
): Promise<Response> {
  return apiFetch(`${BASE_URL}/${id}/archive`, getAccessToken, { method: 'PATCH' });
}

// Unarchives an item.
export async function unarchiveItem(
  id: string,
  getAccessToken: AccessTokenGetter
): Promise<Response> {
  return apiFetch(`${BASE_URL}/${id}/unarchive`, getAccessToken, { method: 'PATCH' });
}