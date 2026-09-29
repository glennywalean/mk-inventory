import { useEffect, useState } from 'react';
import { Routes, Route, Link} from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import ArchivedPage from './pages/ArchivedPage';
import type { Item } from './types';
import {
  getItems,
  getArchivedItems,
  createItem,
  updateQuantity,
  updateItem,
  archiveItem,
  unarchiveItem,
} from './api';
import CreateItemForm from './components/CreateItemForm';
import ItemList from './components/ItemList';


function App() {
  const { isAuthenticated, isLoading: authLoading, getAccessTokenSilently, loginWithRedirect, logout, user } = useAuth0();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [archivedItems, setArchivedItems] = useState<Item[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState('');

  // --- Function to Load Items --- //
  async function loadItems() {
    const data = await getItems(() => getAccessTokenSilently());
    setItems(data);
    setLoading(false);
  }

  // --- Function to Load Archived Items --- //
  async function loadArchivedItems() {
    const data = await getArchivedItems(() => getAccessTokenSilently());
    setArchivedItems(data);
  }

  // --- Function Create New Item --- //
  async function handleCreate() {
    setError('');

    const res = await createItem({
      name,
      priceCents: Math.round(Number(price) * 100),
      quantity: Number(quantity),
    }, () => getAccessTokenSilently());

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
    const res = await archiveItem(itemId, () => getAccessTokenSilently());

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
    const res = await unarchiveItem(itemId, () => getAccessTokenSilently());

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
    const res = await updateQuantity(id, newQuantity, () => getAccessTokenSilently());

    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? 'Something went wrong');
      return;
    }

    loadItems();
  }

  // --- Function to Update Item's Details (Name and Price) --- //
  async function handleUpdateItem(id: string, data: { name: string; priceCents: number }
  ): Promise<void> {
    const res = await updateItem(id, data, () => getAccessTokenSilently());

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error ?? 'Could not update item');
    }

    const updatedItem: Item = await res.json();
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  }

  useEffect(() => {
    if (!isAuthenticated) return;

    Promise.all([
      getItems(() => getAccessTokenSilently()),
      getArchivedItems(() => getAccessTokenSilently()),
    ]).then(([activeItems, archived]) => {
      setItems(activeItems);
      setArchivedItems(archived);
      setLoading(false);
    }).catch(() => {
      setError('Could not load inventory. Please try signing in again.');
      setLoading(false);
    });
  }, [getAccessTokenSilently, isAuthenticated]);

  if (authLoading) {
    return <p className="p-4 text-center">Checking your session...</p>;
  }

  if (!isAuthenticated) {
    return (
      <main className="mx-auto max-w-lg p-6 text-center">
        <h1 className="mb-3 text-2xl font-semibold text-neutral-900">Manado Kitchen Inventory</h1>
        <p className="mb-5 text-neutral-600">Sign in to manage inventory.</p>
        <button
          onClick={() => loginWithRedirect()}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white active:bg-neutral-700"
        >
          Log in
        </button>
      </main>
    );
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  // Filter the loaded items (frontend only), refresh every keystroke. case insensitive
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <header className="mx-auto flex max-w-lg items-center justify-between px-4 pt-4 text-sm">
        <span className="truncate text-neutral-600">{user?.email}</span>
        <button
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          className="font-medium text-neutral-700 underline"
        >
          Log out
        </button>
      </header>
      <Routes>
      <Route
        path='/'
        element={
          <div className="min-h-screen bg-neutral-50">
            <div className="mx-auto max-w-lg p-4">
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

              <div className="flex items-center justify-between">
                <h2 className="mb-3 text-lg font-semibold text-neutral-900">Menu</h2>

                <button
                  onClick={() => setEditMode(!editMode)}
                  className={
                    editMode
                      ? 'mb-3 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white active:bg-neutral-700'
                      : 'mb-3 rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 active:bg-neutral-100'
                  }
                >
                  {editMode ? 'Done' : 'Edit'}
                </button>
              </div>

              <input
                placeholder="Search items"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-3 w-full rounded-md border border-neutral-300 px-3 py-2 text-base"
              />

              <ItemList
                items={filteredItems}
                editMode={editMode}
                emptyMessage={search ? `No items matching "${search}"` : `No items yet.`} //no match = no items matching, empty = no items yet.
                onUpdateQuantity={handleUpdateQuantity}
                onArchive={handleArchive}
                onUpdateItem={handleUpdateItem}
              />

              <Link
                to="/archived"
                className="mt-4 block rounded-md border border-neutral-300 px-4 py-2 text-center text-sm font-medium text-neutral-700 active:bg-neutral-100"
              >
                View archived items
              </Link>
            </div>
        </div>
        }
      />

      <Route
        path='/archived'
        element={<ArchivedPage items={archivedItems} onUnarchive={handleUnarchive} />}
      />
      </Routes>
    </>


    
  );
}

export default App;