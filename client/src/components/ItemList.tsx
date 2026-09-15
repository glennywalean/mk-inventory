import type { Item } from '../types';

type ItemListProps = {
  items: Item[];
  editMode: boolean;
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onArchive: (id: string) => void;
};

function ItemList({ items, editMode, onUpdateQuantity, onArchive }: ItemListProps) {
  if (items.length === 0) {
    return <p>No items yet.</p>;
  }

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.name} — {(item.priceCents / 100).toFixed(2)} —{' '}
          {item.quantity > 0 ? `${item.quantity} available` : 'Sold out'}
          {editMode && (
            <>
              <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => onArchive(item.id)}>Archive</button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

export default ItemList;