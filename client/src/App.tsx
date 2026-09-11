import { useEffect, useState } from 'react';

type Item = { // Declare the item to match the backend model
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
  quantity: number;
};

function App() {
  const [items, setItems] = useState<Item[]>([]); // State to store the items fetched from the backend API
  const [loading, setLoading] = useState(true); // A loading state

  useEffect(() => { // Fetch the items from the backend API and update the state based on the result
    fetch('http://localhost:3000/api/items')
      .then((res) => res.json()) // Parse the response as JSON
      .then((data) => { // Update the data state with the fetched items and set loading to false
        setItems(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>; // Loading message while the data is being fetched

  return (
    <div>
      <h1>Manado Kitchen Inventory</h1>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} — Rp {item.priceCents / 100} —{' '}
            {item.quantity > 0 ? `${item.quantity} available` : 'Sold out'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;