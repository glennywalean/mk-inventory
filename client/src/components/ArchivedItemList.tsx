import type { Item } from '../types';

type ArchivedItemListProps = {
  items: Item[];
  onUnarchive: (id: string) => void;
};

function ArchivedItemList({ items, onUnarchive }: ArchivedItemListProps) {
  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold text-neutral-900">Archived Items</h2>
      
      {items.length === 0 ? (
        <p className="text-neutral-500">No archived items.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-3"
            >
              <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-neutral-900">{item.name}</p>
                  <p className="text-sm text-neutral-500">{(item.priceCents / 100).toFixed(2)}</p>
              </div>

              <button
                onClick={() => onUnarchive(item.id)}
                className="shrink-0 rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white active:bg-neutral-700"
              >
                Unarchive
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ArchivedItemList;