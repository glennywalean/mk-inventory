import { Link } from 'react-router-dom';
import type { Item } from '../types';
import ArchivedItemList from '../components/ArchivedItemList';

type ArchivedPageProps = {
  items: Item[];
  onUnarchive: (id: string) => void;
};

function ArchivedPage({ items, onUnarchive }: ArchivedPageProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-lg p-4">
        <Link to="/" className="mb-4 inline-block text-sm text-neutral-600 underline">
          ← Back to items
        </Link>

        <ArchivedItemList items={items} onUnarchive={onUnarchive} />
      </div>
    </div>
  );
}

export default ArchivedPage;