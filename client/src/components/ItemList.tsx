import type { Item } from '../types';

type ItemListProps = {
  items: Item[];
  editMode: boolean;
  emptyMessage: string; 
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onArchive: (id: string) => void;
};

function ItemList({ items, editMode, emptyMessage, onUpdateQuantity, onArchive }: ItemListProps) {
  if (items.length === 0) {
    return <p className="text-neutral-500">{emptyMessage}</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
        key={item.id}
        className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-neutral-900">{item.name}</p>
            <p className="text-sm text-neutral-500">
              ${(item.priceCents / 100).toFixed(2)}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span
              className={
                item.quantity > 0
                  ? 'rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800' // if available
                  : 'rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800' // if sold out
              }
            >{item.quantity > 0 ? `${item.quantity} left` : 'Sold out'}</span>

            {editMode && (
            <>
              <button // Add Quantity Button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className="h-8 w-8 rounded-md border border-neutral-300 font-bold text-neutral-700 active:bg-neutral-100"
              >
                -
              </button>

              <button // Substract Quantity Button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="h-8 w-8 rounded-md border border-neutral-300 font-bold text-neutral-700 active:bg-neutral-100"
              >
                +
              </button>

              <button // Archive Button
                onClick={() => onArchive(item.id)}
                className="rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 active:bg-red-100"
              >
                Archive
              </button>
            </>
          )}
          </div>
          
          
        </li>
      ))}
    </ul>
  );
}

export default ItemList;