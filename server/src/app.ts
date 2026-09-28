import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// --- Fetch all items from the database --- //
app.get('/api/items', async (req, res) => { // Fetch all items from the database
  const showArchived = req.query.archived === 'true'; // Check all archived items

  const items = await prisma.item.findMany({
    where: { isActive: !showArchived }, // Filter items based on the isActive status
    orderBy: { name: 'asc' }
  });
  res.json(items);
});

// --- Create a new item with validations --- //
app.post('/api/items', async (req, res) => {
  const { name, description, priceCents, quantity } = req.body;

  if (!name || typeof name !== 'string') { // Name has to be a non-empty string
    return res.status(400).json({ error: 'name is required' });
  }
  if (typeof priceCents !== 'number' || priceCents < 0) { // Price in cents must be a non-negative number
    return res.status(400).json({ error: 'priceCents must be a non-negative number' });
  }
  if (typeof quantity !== 'number' || quantity < 0) { // Quantity must be a non-negative number
    return res.status(400).json({ error: 'quantity must be a non-negative number' });
  }

  const item = await prisma.item.create({ // if successful, create the item in the database with the provided data
    data: { name, description, priceCents, quantity }
  });
  res.json(item); // Return the new item as a JSON response
});

// --- Update existing item's quantity, name, price--- //
app.patch('/api/items/:id', async (req, res) => {
  const { quantity, name, priceCents } = req.body;
  const data: { quantity?: number; name?: string; priceCents?: number } = {};

  if (quantity !== undefined) { // quantity error handling
    if (typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({ error: 'quantity must be a non-negative number' });
    }
    data.quantity = quantity; // update the quantity var
  }

  if (name !== undefined) { // name error handling
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'name is required' });
    }
    data.name = name.trim(); // trim() and update the name var
  }

  if (priceCents !== undefined) { // price error handling
    if (!Number.isInteger(priceCents) || priceCents < 0) {
      return res.status(400).json({ error: 'priceCents must be a non-negative integer' });
    }
    data.priceCents = priceCents; // update the price var
  }

  if (Object.keys(data).length === 0) { // make sure the field is not empty
    return res.status(400).json({ error: 'at least one field is required' });
  }

  try {
    const item = await prisma.item.update({
      where: { id: req.params.id }, //target the update into the selected item's id
      data,
    });
    res.json(item);
  } catch {
    res.status(404).json({ error: 'Item not found' });
  }
});

// --- Archive item --- //
app.patch('/api/items/:id/archive', async (req, res) => {
  try {
    const item = await prisma.item.update({
      where: { id: req.params.id },
      data: { isActive: false }
    });
    res.json(item);
  } catch (err) {
    res.status(404).json({ error: 'Item not found' });
  }
});

// --- Unarchive item --- //
app.patch('/api/items/:id/unarchive', async (req, res) => {
  try {
    const item = await prisma.item.update({
      where: { id: req.params.id },
      data: { isActive: true }
    });
    res.json(item);
  } catch (err) {
    res.status(404).json({ error: 'Item not found' });
  }
});

export default app;
