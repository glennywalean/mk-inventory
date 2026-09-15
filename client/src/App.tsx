import { useEffect, useState } from 'react';
import { Routes, Route, Link} from 'react-router-dom';
import ArchivedPage from './pages/ArchivedPage';
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

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [archivedItems, setArchivedItems] = useState<Item[]>([]);
  const [editMode, setEditMode] = useState(false);

  // --- Function to Load Items --- //
  async function loadItems() {
    const data = await getItems();
    setItems(data);
    setLoading(false);
  }

  // --- Function to Load Archived Items --- //
  async function loadArchivedItems() {
    const data = await getArchivedItems();
    setArchivedItems(data);
  }

  // --- Function Create New Item --- //
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

  // --- Function to Archive Item --- //
  async function handleArchive(itemId: string) {
    const res = await archiveItem(itemId);

    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? 'Something went wrong');
      return;
    }

    loadItems();
    loadArchivedItems();
  }

  // --- Function to UnArchive Item --- //
  async function handleUnarchive(itemId: string) {
    const res = await unarchiveItem(itemId);

    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? 'Something went wrong');
      return;
    }

    loadItems();
    loadArchivedItems();
  }

  // --- Function to Update Quantity --- //
  async function handleUpdateQuantity(id: string, newQuantity: number) {
    const res = await updateQuantity(id, newQuantity);

    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? 'Something went wrong');
      return;
    }

    loadItems();
  }

  useEffect(() => { // when loaded, run this
    loadItems();
    loadArchivedItems();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Routes>
      <Route
        path='/'
        element={
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

            <button onClick={() => setEditMode(!editMode)}>
              {editMode ? 'Done' : 'Edit'}
            </button>

            <ItemList
              items={items}
              editMode={editMode}
              onUpdateQuantity={handleUpdateQuantity}
              onArchive={handleArchive}
            />

            <Link to="/archived">View archived items</Link>
         </div>
        }
      />

      <Route
        path='/archived'
        element={<ArchivedPage items={archivedItems} onUnarchive={handleUnarchive} />}
      />
    </Routes>


    
  );
}

export default App;