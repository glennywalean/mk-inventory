import { Link } from 'react-router-dom';
import type { Item } from '../types';
import ArchivedItemList from '../components/ArchivedItemList';

type ArchivedPageProps = {
  items: Item[];
  onUnarchive: (id: string) => void;
};

function ArchivedPage({ items, onUnarchive }: ArchivedPageProps) {
  return (
    <div>
      <Link to="/">Back to items</Link> {/* go Home */}
      <ArchivedItemList items={items} onUnarchive={onUnarchive} />
    </div>
  );
}

export default ArchivedPage;