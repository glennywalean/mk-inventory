import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/api/items', async (req, res) => { // Fetch all items from the database
  const items = await prisma.item.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  });
  res.json(items);
});

app.post('/api/items', async (req, res) => { // Create a new item in the database with validation checks for required fields and data types
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

app.patch('/api/items/:id', async (req, res) => { // Update the quantity of an item in the database
  const { quantity } = req.body;

  if (typeof quantity !== 'number' || quantity < 0) { // Validate that quantity is a non-negative number
    return res.status(400).json({ error: 'quantity must be a non-negative number' });
  }

  try { // Attempt to update the item, if it doesn't exist, catch a 404 error
    const item = await prisma.item.update({
      where: { id: req.params.id },
      data: { quantity }
    });
    res.json(item);
  } catch (err) {
    res.status(404).json({ error: 'Item not found' });
  }
});

app.patch('/api/items/:id/archive', async (req, res) => { // Archive an item in the database by setting isActive to false
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

app.patch('/api/items/:id/unarchive', async (req, res) => { // Unarchive an item in the database by setting isActive to true
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
