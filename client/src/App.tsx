import { useEffect, useState } from 'react';
import type { Item } from './types';
import {
  getItems,
  getArchivedItems,
  createItem,
  updateQuantity,
  archiveItem,
  unarchiveItem,
} from './api';
import CreateItemForm from './components/CreateItemForm';
import ItemList from './components/ItemList';
import ArchivedItemList from './components/ArchivedItemList';

function App() {
  // --- List States --- //
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- Form States --- //
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const [archivedItems, setArchivedItems] = useState<Item[]>([]);
  const [showArchived, setShowArchived] = useState(false);

  async function loadItems() {
    const data = await getItems();
    setItems(data);
    setLoading(false);
  }

  async function loadArchivedItems() {
    const data = await getArchivedItems();
    setArchivedItems(data);
  }

  async function handleCreate() {
    setError('');

    const res = await createItem({
      name,
      priceCents: Math.round(Number(price) * 100),
      quantity: Number(quantity),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? 'Something went wrong');
      return;
    }

    setName('');
    setPrice('');
    setQuantity('');
    loadItems();
  }

  async function handleArchive(itemId: string) {
    const res = await archiveItem(itemId);

    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? 'Something went wrong');
      return;
    }

    loadItems();
  }

  async function handleUnarchive(itemId: string) {
    const res = await unarchiveItem(itemId);

    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? 'Something went wrong');
      return;
    }

    loadArchivedItems();
  }

  function handleToggleArchived() {
    if (!showArchived) {
      loadArchivedItems();
    }
    setShowArchived(!showArchived);
  }

  async function handleUpdateQuantity(id: string, newQuantity: number) {
    const res = await updateQuantity(id, newQuantity);

    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? 'Something went wrong');
      return;
    }

    loadItems();
  }

  useEffect(() => {
    loadItems();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <CreateItemForm
        name={name}
        price={price}
        quantity={quantity}
        error={error}
        onNameChange={setName}
        onPriceChange={setPrice}
        onQuantityChange={setQuantity}
        onSubmit={handleCreate}
      />

      <ItemList
        items={items}
        onUpdateQuantity={handleUpdateQuantity}
        onArchive={handleArchive}
      />

      <button onClick={handleToggleArchived}>
        {showArchived ? 'Hide archived items' : 'Show archived items'}
      </button>

      {showArchived && (
        <ArchivedItemList items={archivedItems} onUnarchive={handleUnarchive} />
      )}
    </div>
  );
}

export default App;