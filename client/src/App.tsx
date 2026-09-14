import { useEffect, useState } from 'react';

// --- Declare the item type to match the backend model --- //
type Item = {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
  quantity: number;
};

function App() {

  // --- List States --- //
  const [items, setItems] = useState<Item[]>([]); // State to store the items fetched from the backend API
  const [loading, setLoading] = useState(true); // A loading state
  const [error, setError] = useState(''); // Holds any error message, '' means no error

  // --- Form States --- //
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const [archivedItems, setArchivedItems] = useState<Item[]>([]);
  const [showArchived, setShowArchived] = useState(false);

  // --- Function to fetch items from the backend API --- //
  async function loadItems() {
    const res = await fetch('http://localhost:3000/api/items'); // Fetch the items from the backend API
    const data = await res.json(); // parse the JSON body into a real JS array
    setItems(data); // update the items state with the newly fetched data
    setLoading(false); // change the loading state to false
  }

  // --- Function to handle the Create Item Form --- //
  async function handleCreate() {
    setError(''); // Clear any previous error message

    const res = await fetch('http://localhost:3000/api/items', {
      method: 'POST', // use POST method to match the backend API route
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ // Send the Form Data to the backend API
        name, // string datatype
        priceCents: Math.round(Number(price) * 100), // Convert datatype from stringto number and convert to cents
        quantity: Number(quantity), // Convert quantity to a number datatype
      }),
    });

    // Error Handling: If res got an error, set the error state and return early without clearing the Form Fields
    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? 'Something went wrong'); // Error Handling Message
      return; // Exit the function without clearing the form fields
    }

    // Success: Clear the Form Fields
    setName(''); // Clear the name field
    setPrice(''); // Clear the price field
    setQuantity(''); // Clear the quantity field
    loadItems(); // Refresh the list of items after a successful creation
  }

  async function handleArchive(itemId: string) {
    const res = await fetch(`http://localhost:3000/api/items/${itemId}/archive`, { //get the itemId of the item to be archived
      method: 'PATCH', // use PATCH method to match the backend API route
    });

    if (!res.ok) { // Error Handling: if res got an error, set the error state and return without clearing the form fields
      const body = await res.json();
      setError(body.error ?? 'Something went wrong');
      return;
    }

    loadItems(); // Refresh the list after a successful archive operations
  }

  // --- Function to handle Unarchive Button --- //
  async function handleUnarchive(itemId: string) {
    const res = await fetch(`http://localhost:3000/api/items/${itemId}/unarchive`, {
      method: 'PATCH',
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? 'Something went wrong');
      return;
    }

    loadArchivedItems(); // refresh everytime the function is triggered
  }

  async function loadArchivedItems() {
    const res = await fetch('http://localhost:3000/api/items?archived=true', { // Fetch all the archived items
      cache: 'no-store', // to always get a fresh data instead of cached data
    });
    const data = await res.json();
    setArchivedItems(data);
  }

  async function handleUpdateQuantity(id: string, newQuantity: number) {
    const res = await fetch(`http://localhost:3000/api/items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQuantity }),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? 'Something went wrong');
      return;
    }

    loadItems(); // Refresh the list after a successful update}
  }

  function handleToggleArchived() {
    if (!showArchived) {
      loadArchivedItems(); // only fetch when opening the view
    }
    setShowArchived(!showArchived);
  }

  useEffect(() => {
    loadItems(); // Run the data fetching function
  }, []);

  // --- Loading State: Show a loading message UI instead of empty list while the data is being fetched --- //
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <input
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)} // Update the name state when the input value changes
      />
      <input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)} // Update the price state when the input value changes
      />
      <input
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)} // Update the quantity state when the input value changes
      />
      <button onClick={handleCreate}>Add item</button>

      {error && <p>{error}</p>}

      {items.length === 0 ? ( //short if else statement to check if there are any items in the list
        <p>No items yet.</p> //display if there's no items in the list
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.name} — {(item.priceCents / 100).toFixed(2)} —{' '}
              {item.quantity > 0 ? `${item.quantity} available` : 'Sold out'}
              <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => handleArchive(item.id)}>Archive</button>
            </li>
          ))}
        </ul>
      )}
      
      <button onClick={handleToggleArchived}>
        {showArchived ? 'Hide archived items' : 'Show archived items'}
      </button>
      {showArchived && (
        <div>
          <h2>Archived Items</h2>
          {archivedItems.length === 0 ? (
            <p>No archived items.</p>
          ) : (
            <ul>
              {archivedItems.map((item) => (
                <li key={item.id}>
                  {item.name} — {(item.priceCents / 100).toFixed(2)}
                  <button onClick={() => handleUnarchive(item.id)}>Unarchive</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>

  );
}

export default App;