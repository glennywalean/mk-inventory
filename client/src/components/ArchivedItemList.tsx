import type { Item } from '../types';

type ArchivedItemListProps = {
  items: Item[];
  onUnarchive: (id: string) => void;
};

function ArchivedItemList({ items, onUnarchive }: ArchivedItemListProps) {
  return (
    <div>
      <h2>Archived Items</h2>
      {items.length === 0 ? (
        <p>No archived items.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.name} — {(item.priceCents / 100).toFixed(2)}
              <button onClick={() => onUnarchive(item.id)}>Unarchive</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ArchivedItemList;