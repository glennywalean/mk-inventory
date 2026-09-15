type CreateItemFormProps = {
  name: string;
  price: string;
  quantity: string;
  error: string;
  onNameChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
  onSubmit: () => void;
};

// This component owns no state of its own. Every value it shows, and every
// function it calls, is handed to it from the parent (App.tsx) as props.
// That's why it's called a "controlled" or "presentational" component —
// it just displays what it's given and reports events back upward.
function CreateItemForm({
  name,
  price,
  quantity,
  error,
  onNameChange,
  onPriceChange,
  onQuantityChange,
  onSubmit,
}: CreateItemFormProps) {
  return (
    <div className="mb-4 space-y-3 rounded-lg border border-neutral-200 bg-white p-4">
      <input
        placeholder="Item name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-base"
      />

      <div className="flex gap-3">
        <input
          placeholder="Price"
          value={price}
          onChange={(e) => onPriceChange(e.target.value)}
          inputMode="decimal"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-base"
        />
        <input
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => onQuantityChange(e.target.value)}
          inputMode="numeric"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-base"
        />
      </div>



      <button
      onClick={onSubmit}
      className="w-full rounded-md bg-neutral-900 py-3 font-medium text-white active:bg-neutral-700"
      >
        Add item
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default CreateItemForm;