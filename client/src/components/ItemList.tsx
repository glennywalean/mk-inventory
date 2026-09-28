import type { Item } from '../types';
import { useState } from 'react';

type ItemListProps = {
  items: Item[];
  editMode: boolean;
  emptyMessage: string; 
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onUpdateItem: (
    id: string,
    data: { name: string; priceCents: number }
  ) => Promise<void>;
  onArchive: (id: string) => void;
};

type ItemRowProps = {
  item: Item;
  editMode: boolean;
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onArchive: (id: string) => void;
  onUpdateItem: (
    id: string,
    data: { name: string; priceCents: number }
  ) => Promise<void>;
};

function ItemRow({
  item,
  editMode,
  onUpdateQuantity,
  onArchive,
  onUpdateItem,
}: ItemRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState((item.priceCents / 100).toFixed(2));
  const [error, setError] = useState('');

  function beginEditing() { // set initial editing state
    setName(item.name);
    setPrice((item.priceCents / 100).toFixed(2));
    setError('');
    setIsEditing(true);
  }

  async function saveEdit() { //excecuted when edit is saved
    const trimmedName = name.trim();
    const numericPrice = Number(price);
    const priceCents = Math.round(numericPrice * 100);

    if (!trimmedName) { //name field error handling
      setError('Name is required');
      return;
    }
    if (
      !Number.isFinite(numericPrice) ||
      numericPrice < 0 ||
      priceCents < 0
    ) {
      setError('Price must be zero or greater');
      return;
    }

    try {
      await onUpdateItem(item.id, { name: trimmedName, priceCents });
      setIsEditing(false);
      setError('');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not update item');
    }
  }

  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-3">
      <div className="min-w-0 flex-1">
        {isEditing ? (
          <div className="space-y-2">
            <input
              aria-label="Item name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-md border border-neutral-300 px-3 py-2"
            />
            <input
              aria-label="Price"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              inputMode="decimal"
              className="w-full rounded-md border border-neutral-300 px-3 py-2"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        ) : (
          <>
            <p className="truncate font-medium text-neutral-900">{item.name}</p>
            <p className="text-sm text-neutral-500">
              ${(item.priceCents / 100).toFixed(2)}
            </p>
          </>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className={
          item.quantity > 0
            ? 'rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800'
            : 'rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800'
        }>
          {item.quantity > 0 ? `${item.quantity} left` : 'Sold out'}
        </span>

        {isEditing ? (
          <>
            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            <button type="button" onClick={saveEdit}>Save</button>
          </>
        ) : editMode ? (
          <>
            <button type="button" onClick={beginEditing}>Edit</button>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            >
              -
            </button>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              +
            </button>
            <button type="button" onClick={() => onArchive(item.id)}>Archive</button>
          </>
        ) : null}
      </div>
    </li>
  );
}

// Item list on Read Mode
function ItemList({ items, editMode, emptyMessage, onUpdateQuantity, onArchive, onUpdateItem }: ItemListProps) {
  if (items.length === 0) {
    return <p className="text-neutral-500">{emptyMessage}</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <ItemRow
          key={item.id}
          item={item}
          editMode={editMode}
          onUpdateQuantity={onUpdateQuantity}
          onArchive={onArchive}
          onUpdateItem={onUpdateItem}
        />
      ))}
    </ul>
  );
}

export default ItemList;